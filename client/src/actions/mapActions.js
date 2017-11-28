import { SET_MAIN_MARKER, SET_SECONDARY_MARKER } from './list'

export function changeMainMarker (val) {
	if (val === undefined) {
		return new Error(val)
	}

	return {
		type: SET_MAIN_MARKER,
		payload: val
	}

}


export function changeSecondaryMarker (val) {
	if (val === undefined) {
		return new Error (val)
	}

	return {
		type: SET_SECONDARY_MARKER,
		payload: val
	}
}