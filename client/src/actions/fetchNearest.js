import store from 'src/store'
import { 
	FETCH_SHOPS, 
	FETCH_SHOPS_SUCC, 
	FETCH_SHOPS_ERR, 
	FETCH_AMENITIES,
	FETCH_AMENITIES_SUCC,
	FETCH_AMENITIES_ERR
} from 'src/actions/list'


const makeQuery = (what, args) => {

	what = what === 'amenities' ? 'Amenities' : 'Shops'

	console.assert(args.str !== undefined)
	console.assert(args.lat !== undefined)
	console.assert(args.lng !== undefined)

	return `
		{ 
	  		nearestInterests (
	  			type: "${args.str}", 
	  			lat: ${args.lat}, 
	  			lng: ${args.lng} 
	  			${args.inArea ? ', inArea: '+ args.inArea : ''}
	  		) {
	    		name
	    		geojson {
	      			lat lng
	    		}
			}	 
		}
	`
}


function fetchData (what, args) {
	return new Promise ((resolve, reject) => {

		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: makeQuery(what, args),
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			resolve(json)
		})
			
	})
}


export default function () {

	// we need state to determine, if we need to fetch SHOPS or AMENITIES
	// this determine FIRST SELECT, and value of this select we have STORED in STORE
	const state = store.getState() // get actual state of store

	const { firstSelect, secondSelect } = state.select
	const { coordinates } = state.mainMarker
	const inArea = state.rangeValue


	const argsForQuery = {
		lng: coordinates.lng,
		lat: coordinates.lat,
		str: secondSelect,
		inArea
	}

	
	return function (dispatch) {

		dispatch({
			type: FETCH_AMENITIES
		})

		return fetchData('amenities', argsForQuery)
		.then(json => json.data.nearestInterests)
		.then(amenities => {
			dispatch({type: FETCH_AMENITIES_SUCC, payload: amenities})
		})
		.catch(err => ({type: FETCH_AMENITIES_ERR, payload: err}))				
	}


}