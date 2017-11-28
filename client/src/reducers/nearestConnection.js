import { 
	FETCH_NEAREST_CONNECTION,
	FETCH_NEAREST_CONNECTION_SUCC,
	FETCH_NEAREST_CONNECTION_ERR,
} from 'src/actions/list'


const defaultState = {
	items: [],
	err: null,
	loading: false
}


export default function (state=defaultState, action) {

	switch (action.type) {
		case FETCH_NEAREST_CONNECTION: return {...state, loading: true}
		case FETCH_NEAREST_CONNECTION_SUCC: return {...state, items: action.payload, err: null, loading: false}
		case FETCH_NEAREST_CONNECTION_ERR: return {...state, err: action.payload, loading: false}
		default: return state
	}
}