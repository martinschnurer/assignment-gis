import { host } from 'src/config'

let db = null


export default function get() {
	
	return new Promise((resolve, reject) => {

		if (db) {
			return resolve(db)
		}
		
		fetch(`${host}/api/shops`)
		.then(res => res.json())
		.then(json => {
			db = json.data;

			return resolve(json.data)
		}).catch(err => reject(err))
	})
		
}
