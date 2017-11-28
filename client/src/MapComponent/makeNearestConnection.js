import React from 'react'
import { Polyline, Circle } from 'react-google-maps'
import MarkerWithWindow from 'src/reducers/MarkerWithWindow'


export default function (arr) {

	if (arr instanceof Array === false) return new Error('must be array')

	let final_arr = []

	arr.forEach(row => {

		row.firstRelation.forEach(obj => {
			final_arr.push(<Polyline 
				path={obj.points} 
				options={{
					strokeColor: 'blue',
					strokeOpacity: 0.5
				}}
			/>)
		})

		row.secondRelation.forEach(obj => {
			final_arr.push(<Polyline 
				path={obj.points}
				options={{
					strokeColor: 'green',
					strokeOpacity: 0.5
				}} 
			/>)
		})


		final_arr.push(
			<MarkerWithWindow 
				icon={{
					url: 'http://www.newdesignfile.com/postpic/2010/10/bus-transportation-icon_373174.png',
					scaledSize: {width: 30, height: 30}
				}}
				position={row.firstGetOn.geojson} 
			>
				<div>
					<h2>{row.firstGetOn.name}</h2>
					<h4>{row.firstRelationMeta.name}</h4>
				</div>
			</MarkerWithWindow>
		)

		final_arr.push(
			<MarkerWithWindow 
				icon={{
					url: 'http://www.newdesignfile.com/postpic/2010/10/bus-transportation-icon_373174.png',
					scaledSize: {width: 30, height: 30}
				}}
				position={row.secondGetOn.geojson} 
			>
				<div>
					<h2>{row.secondGetOn.name}</h2>
					<h4>{row.secondRelationMeta.name}</h4>
				</div>
			</MarkerWithWindow>
		)
		
		final_arr.push(
			<MarkerWithWindow 
				icon={{
					url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/MTS_Bus_icon.svg/500px-MTS_Bus_icon.svg.png',
					scaledSize: {width: 20, height: 20}
				}}
				position={row.firstGetOut.geojson} 
			>
				<div>
					<h2>{row.firstGetOut.name}</h2>
					<h4>{row.firstRelationMeta.name}</h4>
				</div>
			</MarkerWithWindow>
		)

		final_arr.push(
			<MarkerWithWindow
				position={row.secondGetOut.geojson}
				icon={{
					url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/MTS_Bus_icon.svg/500px-MTS_Bus_icon.svg.png',
					scaledSize: {width: 20, height: 20}
				}}
			>
				<div>
					<h2>{row.secondGetOut.name}</h2>
					<h4>{row.secondRelationMeta.name}</h4>
				</div>
			</MarkerWithWindow>
		)



		final_arr.push(
			<MarkerWithWindow
				position={row.amenity.geojson}
				icon={{
					url: 'https://static1.squarespace.com/static/52fbc928e4b0b0a74813e545/566a3ae8c21b86abf16d72b3/581789c520099e8211e9f33f/1477937609084/sketch.png',
					scaledSize: {width: 30, height: 30}
				}}
			>
				<h2>{row.amenity.name}</h2>
			</MarkerWithWindow>
		)
	})

	return final_arr
}