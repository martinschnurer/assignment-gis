import store from 'src/store'
import { 
	FETCH_NEAREST_STOPS, 
	FETCH_NEAREST_STOPS_SUCC, 
	FETCH_NEAREST_STOPS_ERR,
	HIDE_NEAREST } from 'src/actions/list'

function makeQuery (args) {

	return `
		{ 
			getAmenitiesByStops(
				lat: ${args.lat}, 
				lng: ${args.lng}, 
				type: "${args.type}"
				${args.distanceFromStop ? `,distanceFromStop: ${args.distanceFromStop}` : ''}
			) {
				nearestStops {
					name
					geojson {
						lat lng
					}
				}
				stops {
					name
					geojson { lat lng }
				}
				lines {
					points {
						lat lng	
					}
				}
				amenities {
					name
					geojson { lat lng }
				}
				relation {
					name
					from
					to
					ref
					route
				}
			}
		}
	`
}



function fetchData (args) {
	return new Promise((resolve, reject) => {

		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: makeQuery(args),
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			resolve(json)
		})
		.catch(err => reject(err))	

	})
}



export default function () {

	return function (dispatch) {
		dispatch({type: HIDE_NEAREST})
		dispatch({type: FETCH_NEAREST_STOPS })

		// Get state of whole store
		const state = store.getState()

		// get from store what we need for fetching
		const { secondSelect } = state.select
		const { rangeValue } = state
		const { coordinates } = state.mainMarker
		const { lat, lng } = coordinates

		// small testing here
		console.assert(coordinates !== undefined)
		console.assert(secondSelect !== undefined && secondSelect !== '')
		console.assert(lat !== undefined)
		console.assert(lng !== undefined)

		// fetch Data, get promise
		fetchData({
			lat, 
			lng, 
			type: secondSelect,
			distanceFromStop: rangeValue
		})
		.then(data => {
			console.log('IMPORTANT', data)
			return dispatch({type: FETCH_NEAREST_STOPS_SUCC, payload: data.data.getAmenitiesByStops})
		})
		.catch(err => dispatch({type: FETCH_NEAREST_STOPS_ERR, payload: err}))
	}
}