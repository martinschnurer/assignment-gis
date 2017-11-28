import { SET_FIRST_SELECT, SET_SECOND_SELECT } from './list'


export function setFirstSelect (value) {

	return {
		type: SET_FIRST_SELECT,
		payload: value
	}

}


export function setSecondSelect (value) {

	return {
		type: SET_SECOND_SELECT,
		payload: value
	}

}