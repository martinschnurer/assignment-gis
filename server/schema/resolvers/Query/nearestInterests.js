const pool = require('connectionPool')


module.exports = function (parent, args) {

	let q
	let { limit } = args
	let { lng, lat, type } = args
	let inArea = args.inArea

	console.log(lng, lat, type)

	const optional_dwithin = ``

	if (inArea) {
		q = `
		SELECT
			osm_id as id,
			st_asgeojson(st_transform(way,4326))::jsonb as geojson, 
			tags->'name' as name
		FROM planet_osm_point 
		WHERE 
			(tags->'amenity'=$3::text OR tags->'shop'=$3::text)
			AND st_dwithin(st_transform(way, 4326),st_setsrid(st_makepoint($1::float, $2::float)::geography, 4326), ${inArea})			
	`
} else {
	q = `SELECT
			osm_id as id,
			st_asgeojson(st_transform(way,4326))::jsonb as geojson, 
			tags->'name' as name
		FROM planet_osm_point 
		WHERE 
			(tags->'amenity'=$1::text OR tags->'shop'=$1::text)
		`
}
	

	console.log(q)

	return new Promise((resolve, reject) => {
		pool.connect((err, client, release) => {

			if (err) {
				return reject(err)
			}

			client.query(q, inArea ? [lng, lat, type] : [type], (err, result) => {
				release()

				if (err) {
					return reject(err)
				}

				result.rows = result.rows.map(row => {
					return {
						...row,
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