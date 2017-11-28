export default function (state=[], action) {

	if (action.type === 'FETCH_LINK_SUCC') {
		return action.payload
	}

	return state
}