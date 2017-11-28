import React from 'react'
import MarkerWithWindow from 'src/reducers/MarkerWithWindow'



/**
	array of amenities or shops
	array should contain object  {
		name
		distance // from point clicked
		geojson {
			lat
			lng
		}
	}
*/
function makeObjects (arr) {

	return arr.map(item => {
		return (

			<MarkerWithWindow 
				position={item.geojson}
				icon={{
					url: 'https://image.flaticon.com/icons/png/128/148/148836.png',
					scaledSize: {width: 20, height: 20}
				}}
			>
				<div>
					<p><span>{item.name}</span></p>
				</div>
			</MarkerWithWindow>
		)
	})

}

export default makeObjects