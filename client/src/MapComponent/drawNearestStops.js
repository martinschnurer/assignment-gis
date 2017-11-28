import React from 'react'
import { Polyline, Circle } from "react-google-maps"
import MarkerWithWindow from 'src/reducers/MarkerWithWindow'
import store from 'src/store'


/* SHOULD RETURN ARRAY OF OBJECTS*/
export default function (rows) {

	// everything related with query = Points, Objects, Lines, Markers...
	let mapObjects = []
	let radius = store.getState().rangeValue


	rows.forEach(row => {
		row.lines.forEach( line => {
			mapObjects.push(
				<Polyline 
					path={line.points}
					options={{
						strokeOpacity:0.25
					}}
				/>
			)
		})
	})


	// ALL AMENITIES NEAR TO STOPS
	rows.forEach(row => {
		row.amenities.forEach(amenity => {
			mapObjects.push(
				<MarkerWithWindow 
					position={amenity.geojson}
					icon={{
						url: 'https://image.flaticon.com/icons/png/128/148/148836.png',
						scaledSize: {width: 12, height: 12}
					}}
				>
						<h3>{amenity.name}</h3>
				</MarkerWithWindow>
			)
		})
	})


	// ALL STOPS
	rows.forEach(row => {
		row.stops.forEach(stop => {
			mapObjects.push(
				<MarkerWithWindow 
					position={stop.geojson}
					icon={{
						url: 'http://www.clker.com/cliparts/1/d/9/f/12718435381496695090bus_stop3-hi.png',
						scaledSize: {width: 25, height: 25}
					}}
				>
					<div>
						<div>{stop.name}</div>
						<div>{row.relation.name}</div>
					</div>
				</MarkerWithWindow>
			)

			mapObjects.push(
				<Circle 
					center={stop.geojson} 
					radius={radius}
					options={{
						fillColor: 'rgba(0,255,0,0.1)',
						strokeColor: 'rgba(0,0,0,0.1)',
						strokeWidth: 1
					}}
				/>
			)
		})




	})

	return [
		...mapObjects,
	]
}