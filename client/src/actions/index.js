/*
	@author martin.schnurer
	@date 2017-11-12

	undefined means IDENTITY MAPPING...
	then in reducer we access data with action.payload
	payload will contain data we passed as argument into action function 

	for Example:

	obj = createActions({
		IMPORTANT_ACTION: undefined
	})

	then we somewhere in code call the action "importantAction(12345)"

	then in reducer  (state, action) => {
		console.log(action.payload) // 12345
	}
*/

import shops from './shops'

import * as mapActions from './mapActions'
import * as selects from './Select'
import fetchNearest from './fetchNearest'
import showNearestStops from './showNearestStops'
import hideNearest from './hideNearest'
import setRangeValue from './setRangeValue'
import connectTwoPeople from './fetchNearestConnection'
import showLink from './showLink'

export default {
	...mapActions,
	...selects,
	fetchNearest,
	showNearestStops,
	hideNearest,
	setRangeValue,
	connectTwoPeople,
	shops,
	showLink
}
