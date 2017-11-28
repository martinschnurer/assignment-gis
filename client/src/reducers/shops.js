import { FETCH_SHOPS, FETCH_SHOPS_SUCC, FETCH_SHOPS_ERR } from 'src/actions/list'

export default function (state = {loading: false, items: [], err: null}, action) {

	switch (action.type) {
			
		case FETCH_SHOPS: return {...state, shops: {
			loading: true,
			items: [],
			err: null
		}}

		case FETCH_SHOPS_SUCC: return {...state, shops: {
			loading: false,
			items: action.payload,
			err: null
		}}

		case FETCH_SHOPS_ERR: return {...state, shops: {
			loading: false,
			items: [],
			err: null
		}}

		default: return state
	}
}