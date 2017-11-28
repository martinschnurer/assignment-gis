import React from 'react'
import { Marker, Circle } from 'react-google-maps'
import { SET_MAIN_MARKER, REFRESH_MAIN_MARKER } from 'src/actions/list'
import store from 'src/store'


function makeReactObjectsArr (obj) {
	
	const circleOptions = {
		fillColor: 'rgba(255, 228, 181, 1)',
		strokeColor: 'rgba(50, 50, 50, 0.5)'
	}

	return [
		<Marker position={{ lat: obj.lat, lng: obj.lng}} />,
		<Circle 
			center={{ lat: obj.lat, lng: obj.lng}}
			radius={obj.rangeValue} 
			options={circleOptions}
		/>
	]
}


const defaultState = {
	react: makeReactObjectsArr({lat: 48.147348, lng: 17.109938, rangeValue: 100}),
	coordinates: {
		lat: 48.147348,
		lng: 17.109938,
		lon: 17.109938
	}
}



export default (state=defaultState, action) => {

	if (action.type === SET_MAIN_MARKER) {
		const lng = action.payload.lon
		const lat = action.payload.lat
		const rangeValue = store.getState().rangeValue

		return {
			react: makeReactObjectsArr({lat: lat, lng, rangeValue}),
			coordinates: {
				lng,
				lon: lng,
				lat: action.payload.lat
			}
		}
	}


	if (action.type === REFRESH_MAIN_MARKER) {
		const { coordinates: cords } = state
		const rangeValue = store.getState().rangeValue

		return {
			...state,
			react: makeReactObjectsArr({lat: cords.lat, lng: cords.lng, rangeValue}),
		}
	}


	// default return
	return state
}