import store from 'src/store'
import { 
	FETCH_NEAREST_CONNECTION,
	FETCH_NEAREST_CONNECTION_SUCC,
	FETCH_NEAREST_CONNECTION_ERR
} from 'src/actions/list'


function fetchQuery (obj) {

	const q = `
		{	
		connectTwoPeople (
	    	first_lng: ${obj.first_lng}
			first_lat: ${obj.first_lat}
	    	second_lng: ${obj.second_lng}
	    	second_lat: ${obj.second_lat}
	    	type: "${obj.type}"
	  ) {
	    firstRelation { points { lat lng }}
	    secondRelation { points { lat lng }}
	    firstGetOn {
	    name
	      geojson {
	        lat lng
	      }
	    }
	    firstGetOut {
	      name geojson { lat lng }
	    }
	    
	    secondGetOn {
	      name geojson { lat lng }
	    }
	    
	    secondGetOut {
	      name geojson { lat lng}
	    }
	    amenity {
	      name
	      geojson { lat lng }
	    }

	    firstRelationMeta { name }
	    secondRelationMeta { name }

	  }

	}
	`

	return new Promise((resolve, reject) => {
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: q,
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			json = json.data.connectTwoPeople
			resolve(json)
		})	
		.catch(err => resolve(err))
	})
}


export default function () {

	return function (dispatch) {

		dispatch({type: FETCH_NEAREST_CONNECTION})

		const storeState = store.getState()

		const queryParams = {
			type: storeState.select.secondSelect,
			first_lng: storeState.mainMarker.coordinates.lng,
			first_lat: storeState.mainMarker.coordinates.lat,
			second_lng: storeState.secondaryMarker.coordinates.lng,
			second_lat: storeState.secondaryMarker.coordinates.lat,
		}

		fetchQuery(queryParams)
		.then(data => {
			dispatch({type: FETCH_NEAREST_CONNECTION_SUCC, payload: data})
		})
		.catch(err => {
			dispatch({type: FETCH_NEAREST_CONNECTION_ERR, payload: err})
		})
	}
}