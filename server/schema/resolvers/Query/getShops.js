const pool = require('connectionPool')
const shopsQuery = require('queries/shops')


let cache = {}

function getShops (_, args) {

	if (cache.shops) {
		return cache.shops
	}

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			if (err) {
				return console.error('Error acquiring client', err.stack)
			}
			client.query(shopsQuery, (err, result) => {
				release()
				
				if (err) {
					return reject('Error executing query')
				}

				// console.log(result.rows)
				result = result.rows.map(r => r.shops)

				cache.shops = result
				return resolve(result)
			})
		})

	})	
}

module.exports = getShops