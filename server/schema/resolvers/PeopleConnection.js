const pool = require('connectionPool')

const q = `
SELECT st_asgeojson(st_transform(pol.way, 4326))::jsonb 
FROM relations r
JOIN planet_osm_line pol on pol.osm_id=r.ref
WHERE r.relation_id=$1::bigint and r.type='way'
`


function getRelation (id) {

	const relation_id = id || (function() {throw new Error('relation_id is missing')})

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



function relationMeta (id) {

	const query = `
	WITH mhd_relations as (SELECT * FROM relations where value='MHD Bratislava')
	SELECT * 
	from mhd_relations mhdr
	JOIN relations r ON r.relation_id = mhdr.relation_id
	WHERE r.name='tag' AND r.relation_id=$1::bigint
`

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			
			if (err) {
				return console.error('Error acquiring client', err.stack)
			}
			
			client.query(query, [id], (err, result) => {
				release()
				
				if (err) {
					return reject('Error executing query')
				}				
					
				const row = result.rows

				return resolve({
					relation_id: id,
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



function firstRelation (parent, args) {
	console.log(parent, args)
	return getRelation(parent.first_relation_id)
}


function secondRelation (parent, args) {
	return getRelation(parent.second_relation_id)
}


function firstRelationMeta (parent, args) {
	return relationMeta(parent.first_relation_id)
}

function secondRelationMeta (parent, args) {
	return relationMeta(parent.second_relation_id)
}


module.exports = {
	firstRelation,
	secondRelation,
	firstRelationMeta,
	secondRelationMeta
}