import { SET_FIRST_SELECT, SET_SECOND_SELECT } from 'src/actions/list'

const defaultState = {
	firstSelect: 'amenities',
	secondSelect: 'cafe'
}

export default function (state = defaultState, action) {

	switch (action.type) {

		case SET_FIRST_SELECT: return {...state, firstSelect: action.payload}
		case SET_SECOND_SELECT: return {...state, secondSelect: action.payload}
		default: return state
	}

	return state
}