
import { SET_RANGE_VALUE } from 'src/actions/list'

export default function (state=100, action) {

	if (action.type === SET_RANGE_VALUE) {
		return action.payload
	}

	console.warn('RETURNING PREVIOUS STATE = THIS SHOULDNT HAPPEN')
	return state
}