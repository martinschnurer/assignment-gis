

export default function () {
	
	return function (dispatch) {
		dispatch({type: 'GET_AMENITIES'})
	
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: '{ amenities }',
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			dispatch({type: 'GET_AMENITIES_SUCC', payload: json})
		})
		.catch(err => ({
			type: 'GET_AMENITIES_ERR',
			payload: err
		}))

	}
}