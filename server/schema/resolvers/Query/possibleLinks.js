const pool = require('connectionPool')

const query = `
	WITH mhd_relations as (SELECT * FROM relations where value='MHD Bratislava')
	SELECT * 
	from mhd_relations mhdr
	JOIN relations r ON r.relation_id = mhdr.relation_id
	WHERE r.name='tag'
`

const secondQuery = `
	WITH mhd_relations as (SELECT * FROM relations where value='MHD Bratislava')
	SELECT * 
	from mhd_relations mhdr
	JOIN relations r ON r.relation_id = mhdr.relation_id
	WHERE r.name='tag' AND r.relation_id = $1::bigint
`


let cache = {}


function possibleLinks(parent, args) {

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			if (err) {
				return console.error('Error acquiring client', err.stack)
			}
			client.query(args.id ? secondQuery : query, args.id ? [args.id] : [], (err, result) => {
				release()
				
				if (err) {
					return reject('Error executing query')
				}

				let rows = result.rows

				rows = rows.reduce((acc, row) => {

					acc[row.relation_id] = acc[row.relation_id] === undefined ? {} : acc[row.relation_id]
					
					acc[row.relation_id][row.key] = row.value

					acc[row.relation_id].relation_id = row.relation_id

					return acc
				}, {})


				rows = Object.values(rows)

				return resolve(rows)
			})
		})

	})	
}

module.exports = possibleLinks