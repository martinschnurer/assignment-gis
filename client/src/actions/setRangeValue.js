import { SET_RANGE_VALUE, REFRESH_MAIN_MARKER } from './list'

export default function (val) {
	
	return function (dispatch) {
		
		// SET RANGE VALUE
		dispatch({
			type: SET_RANGE_VALUE,
			payload: val
		})

		// REFRESH CIRCLE ON THE MAP
		dispatch({
			type: REFRESH_MAIN_MARKER
		})
	}

}