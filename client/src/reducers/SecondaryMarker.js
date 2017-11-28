import React from 'react'
import { Marker, InfoWindow } from 'react-google-maps'
import { SET_SECONDARY_MARKER } from 'src/actions/list'



console.assert(InfoWindow !== undefined, 'ERROR')


class MarkerWithWindow extends React.Component {

	constructor() {
		super()
		this.state = {
			windowOpen: false
		}
	}

	render () {

		return (
			<Marker 
				position={this.props.position}
				onClick={() => this.setState({windowOpen: true})}
			>
				{
					this.state.windowOpen && (
						<InfoWindow onCloseClick={() => this.setState({windowOpen: false})}>
							{this.props.children}
						</InfoWindow>
					)
				}
			</Marker>
		)
	}

}


const defaultState = {
	react: null,
	coordinates: null
}


export default (state=defaultState, action) => {

	if (action.type === SET_SECONDARY_MARKER) {
		const lng = action.payload.lon

		const marker = (
			<Marker 
				position={{ lat: action.payload.lat, lng: lng}}
				icon={{
					url: 'https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300',
					scaledSize: {width: 50, height: 50}
				}}
			/>
		)

		return {
			react: marker,
			coordinates: {
				lng,
				lon: lng,
				lat: action.payload.lat
			}
		}	
	}

	return state
}