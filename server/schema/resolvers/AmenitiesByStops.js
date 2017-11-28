const pool = require('connectionPool')

const q = `
select st_asgeojson(st_transform(pol.way, 4326))::jsonb 
from relations r
join planet_osm_line pol on pol.osm_id=r.ref
where r.relation_id=$1::bigint and r.type='way'
`

const query = `
	WITH mhd_relations as (SELECT * FROM relations where value='MHD Bratislava')
	SELECT * 
	from mhd_relations mhdr
	JOIN relations r ON r.relation_id = mhdr.relation_id
	WHERE r.name='tag' AND r.relation_id=$1::bigint
`

let cache = {}
let tmp


function relation (parent, args) {

	if (cache.links) {
		return cache.links
	}

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			
			if (err) {
				return console.error('Error acquiring client', err.stack)
			}
			
			client.query(query, [parent.relation_id], (err, result) => {
				release()
				
				if (err) {
					return reject('Error executing query')
				}				
					
				const row = result.rows

				return resolve({
					relation_id: parent.relation_id,
					from: (tmp = row.find(obj => obj.key === 'from')) ? tmp.value : "",
					to: (tmp = row.find(obj => obj.key === 'to')) ? tmp.value : "",
					ref: (tmp = row.find(obj => obj.key === 'ref')) ? tmp.value : "",
					name: (tmp = row.find(obj => obj.key === 'name')) ? tmp.value : "",
					route: (tmp = row.find(obj => obj.key === 'route')) ? tmp.value : "",
				})
			})
		})

	})	
}



function lines (parent, args) {

	const relation_id = parent.relation_id


	return new Promise((resolve, reject) => {
		pool.connect((err, client, release) => {
			client.query(q, [relation_id], (err, result) => {
				release()

				if (err) {
					return reject(err)
				}

				const lineStrings = result.rows.map(row => {

					const lineString = row.st_asgeojson

					return {points: lineString.coordinates.map(cord => ({
						lng: cord[0],
						lat: cord[1]
					}))}
				})

				resolve(lineStrings) // pole poli objektov
			})
		})	
	})
}



module.exports = {
	lines,
	relation 
}