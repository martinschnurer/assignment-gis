import React from 'react'
import { host } from 'src/config'
import { Circle, Polyline } from 'react-google-maps'


let cache = []
let relations = {}

 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}



export function getGoogleMapArray(relation_id) {
	
	let objects = relations[relation_id]

	return objects.map((obj,i) => {

		if (obj.way === null || obj.way === undefined) return null

		if (obj.way.type === 'LineString') {
			const cords = obj.way.coordinates.map(cord => { 
				return {
					lng: cord[0], 
					lat: cord[1] 
				}
			}) 

			return (
				<Polyline 
					key={`line-${obj.way.coordinates[0]}-${obj.way.coordinates[1]}`}
					path={cords} 
					options={{
						strokeColor: `#${intToRGB(relation_id)}`,
					}}
				/>
				)
		}


		if (obj.way.type === 'Point') {
			const cords = {
				lng: obj.way.coordinates[0],
				lat: obj.way.coordinates[1]
			}

			return (
				<Circle 
					key={`circle-${obj.way.coordinates[0]}-${obj.way.coordinates[1]}`}
					radius={8} 
					center={cords} 
					visible
					options={{
						strokeColor: '#FF0000',
						strokeOpacity: 0.8,
      					fillColor: '#FF0000',
      					fillOpacity: 0.35
      				}}/>
      			)
		}

		return null

	}).filter(obj => obj !== null)
}


export default function get(obj) {
	
	return new Promise((resolve, reject) => {

		fetch(`${host}/api/nearest_transport?lon=${obj.lon}&lat=${obj.lat}`)
		.then(res => res.json())
		.then(json => {

			// cache results
			cache = json
			console.log(cache)

			let transportObj = json.reduce((acc, val) => {

				// if not initialised, then return empty array
				acc[val.relation_id] = acc[val.relation_id] === undefined ? [] : acc[val.relation_id]

				acc[val.relation_id].push(val)

				return acc
			},{})


			// cache another obj
			relations = transportObj


			const links = json.filter(row => row.name === 'tag' && row.key === 'name')
			.map(row => {
				return {
					name: row.value,
					relation_id: row.relation_id
				}
			})


			return resolve({
				relations: transportObj,
				links
			})
		})
		.catch(err => reject(err))	
	})
		
}

