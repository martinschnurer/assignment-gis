import React from 'react'
import { Polyline, Circle } from 'react-google-maps'
import MarkerWithWindow from 'src/reducers/MarkerWithWindow'



export default function (arr) {

	console.log(arr)

	const result_arr = []

	arr.forEach(row => {
		row.stops.forEach(stop => {
			result_arr.push(
				<MarkerWithWindow 
					icon={{
						url: 'http://www.newdesignfile.com/postpic/2010/10/bus-transportation-icon_373174.png',
						scaledSize: {width: 18, height: 18}
					}}
					position={stop.geojson} 
				>
					<div>
						<h2>{stop.name}</h2>
					</div>
				</MarkerWithWindow>
			)
		}) 
	
		row.lines.forEach(line => {
			
			result_arr.push(
				<Polyline path={line.points} />
			)
		})


	})



	return result_arr
}