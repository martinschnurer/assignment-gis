

export default function (link) {

	return function (dispatch) {
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: `{
  						mhdLinks (id: ${link}) {
    							relation_id
    							name
    							stops { name geojson { lat lng} }
    							lines {
    								points { lat lng }
    							}
							}
						}`,
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			dispatch({type: 'FETCH_LINK_SUCC', payload: json.data.mhdLinks})
		})		
	}

}