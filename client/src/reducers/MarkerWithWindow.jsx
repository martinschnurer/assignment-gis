import React from 'react'
import { Marker, InfoWindow } from 'react-google-maps'
import PT from 'prop-types'


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
				icon={this.props.icon}
			>
				{
					this.state.windowOpen && (
						<InfoWindow onCloseClick={() => this.setState({windowOpen: false})}>
							<div>
								{this.props.children}
							</div>
						</InfoWindow>
					)
				}
			</Marker>
		)
	}
}


MarkerWithWindow.propTypes = {
	icon: PT.object
}

MarkerWithWindow.defaultProps = {
	icon: {
		url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/42003-200.png',
		scaledSize: {width: 20, height: 20}
	}
}

export default MarkerWithWindow