import { FETCH_NEAREST_STOPS, FETCH_NEAREST_STOPS_SUCC, FETCH_NEAREST_STOPS_ERR } from 'src/actions/list'


const defaultState = {
	loading: false,
	err: null,
	items: []
}


export default function (state=defaultState, action) {

	switch (action.type) {
		case FETCH_NEAREST_STOPS: return {...state, loading: true, err: null}
		case FETCH_NEAREST_STOPS_SUCC: return {...state, loading: false, items: action.payload}
		case FETCH_NEAREST_STOPS_ERR: return {...state, err: action.payload, loading: false}
		default: return state
	}

	return state
}