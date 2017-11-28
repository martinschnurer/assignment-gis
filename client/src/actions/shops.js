import { FETCH_SHOPS, FETCH_SHOPS_SUCC, FETCH_SHOPS_ERR } from './list'


export default function () {
	
	return function (dispatch) {
		dispatch({type: FETCH_SHOPS})
	
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: '{ shops }',
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			dispatch({type: FETCH_SHOPS_SUCC, payload: json})
		})
		.catch(err => ({
			type: FETCH_SHOPS_ERR,
			payload: err
		}))

	}
}