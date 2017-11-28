import A from '../actions'
import store from '../store'
import { 
	FETCH_SHOPS, 
	FETCH_SHOPS_SUCC, 
	FETCH_SHOPS_ERR, 
	FETCH_AMENITIES,
	FETCH_AMENITIES_SUCC,
	FETCH_AMENITIES_ERR,
	HIDE_NEAREST
} from 'src/actions/list'


const defaultState = {
	err: null,
	items: [],
	loading: false
}

 

export default (state=defaultState, action) => {

	switch (action.type) {
		case FETCH_SHOPS: return {...state, loading: true}
		case FETCH_SHOPS_SUCC: return {...state, items: action.payload, loading: false}
		case FETCH_SHOPS_ERR: return {...state, err: action.payload, loading: false}
		case FETCH_AMENITIES: return {...state, loading: true}
		case FETCH_AMENITIES_SUCC: return {...state, loading: false, items: action.payload}
		case FETCH_AMENITIES_ERR: return {...state, loading: false, err: action.payload}
		case HIDE_NEAREST: return {...state, items: []}
		default: return state
	}

	return state
}