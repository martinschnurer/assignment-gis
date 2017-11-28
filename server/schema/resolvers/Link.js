const pool = require('connectionPool')


const linesQuery = `
SELECT 
  st_asgeojson(st_transform(pol.way, 4326))::jsonb as geojson
FROM relations r
JOIN planet_osm_line pol on r.ref=pol.osm_id
WHERE r.relation_id=$1::bigint
`


const stopsQuery = `
SELECT 
  st_asgeojson(st_transform(pop.way, 4326))::jsonb as geojson, 
  pop.tags->'name' as name 
FROM relations r
JOIN planet_osm_point pop on r.ref=pop.osm_id
WHERE r.relation_id=$1::bigint
`


function lines (parent, args) {

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {

			if (err) {
				return reject(err)
			}

			client.query(linesQuery, [parent.relation_id], (err, result) => {
				release()

				if (err) {
					return reject(err)
				}

				result.rows = result.rows.map(row => {
					return {
						points: row.geojson.coordinates.map(cord => ({
							lng: cord[0],
							lat: cord[1]
						}))
					}
				})

				resolve(result.rows)
			})
		})
	})
}


function stops (parent, args) {
	
	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {

			if (err) {
				return reject(err)
			}

			client.query(stopsQuery, [parent.relation_id], (err, result) => {
				release()

				if (err) {
					return reject(err)
				}

				result.rows = result.rows.map(row => {
					return {
						name: row.name,
						geojson: {
							lng: row.geojson.coordinates[0],
							lat: row.geojson.coordinates[1]	
						}
					}
				})

				resolve(result.rows)
			})
		})
	})
}


module.exports = {
	lines, 
	stops
}