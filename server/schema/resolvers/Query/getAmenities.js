const pool = require('connectionPool')
const amenityQuery = require('queries/amenities')

let cache = {}


function getAmenities(_, args) {

	if (cache.amenities) {
		return cache.amenities
	}

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			if (err) {
				return console.error('Error acquiring client', err.stack)
			}
			client.query(amenityQuery, (err, result) => {
				release()
				
				if (err) {
					return reject('Error executing query')
				}

				result = result.rows.map(r => r.amenity)

				cache.amenties = result
				return resolve(result)
			})
		})

	})	
}

module.exports = getAmenities