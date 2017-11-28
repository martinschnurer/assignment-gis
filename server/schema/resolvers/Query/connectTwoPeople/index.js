const pool = require('connectionPool')
const query = require('./query')


module.exports = function (_, args) {

	return new Promise ((resolve, reject) => {

		pool.connect((err, client, release) => {

			if (err) {
				return reject('Fail at connection to database pool')
			}

			const { first_lng, first_lat, second_lng, second_lat, type } = args

			const queryArgs = [first_lng, first_lat, second_lng, second_lat, type]

			client.query(query, queryArgs, (err, result) => {
				release()

				if (err) {
					return reject(err)
				}

				console.log(JSON.stringify(result.rows[0], false, 2))
				

				const arr = result.rows.map(row => {
					return {
						first_relation_id: row['ns1-relation_id'],
						second_relation_id: row['ns2-relation_id'],
						amenity: {
							name: row['i-name'],
							geojson: {
								lng: row['i-way'].coordinates[0],
								lat: row['i-way'].coordinates[1],
							}
						},
						firstGetOn: {
							name: row['ns1-name'],
							geojson: {
								lng: row['ns1-way'].coordinates[0],
								lat: row['ns1-way'].coordinates[1]
							}
						},
						secondGetOn: {
							name: row['ns2-name'],
							geojson: {
								lng: row['ns2-way'].coordinates[0],
								lat: row['ns2-way'].coordinates[1]
							}
						},
						firstGetOut: {
							name: row['sti-1-name'],
							geojson: {
								lng: row['sti-1-way'].coordinates[0],
								lat: row['sti-1-way'].coordinates[1]
							}
						},
						secondGetOut: {
							name: row['sti-2-name'],
							geojson: {
								lng: row['sti-2-way'].coordinates[0],
								lat: row['sti-2-way'].coordinates[1]	
							}
						}
					}
				})

				resolve(arr)
			})

		})
		
	})

}