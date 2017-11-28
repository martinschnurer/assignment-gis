import React from 'react'
import PT from 'prop-types'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import { connect } from 'react-redux'
import A from 'src/actions'

import makePointsObjects from './makeReactMapObjects'
import drawNearestStops from './drawNearestStops'
import makeNearestConnection from './makeNearestConnection'
import makeShowLink from './makeShowLink'

const MyMapComponent = compose(
  	withProps({
    	googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBqPIJUMOFUMruom3LGh859NVn8po1oqiU&v=3.exp&libraries=geometry,drawing,places",
    	loadingElement: <div style={{ height: `100%` }} />,
    	containerElement: <div style={{ height: `500px` }} />,
    	mapElement: <div style={{ height: `100%` }} />,
  	}),
  		withScriptjs,
  		withGoogleMap
	)((props) =>
  		<GoogleMap
    		defaultZoom={14}
    		defaultCenter={{ lat: 48.1532073, lng: 17.1069213 }}
    		onClick={val => props.onClick(val)}
    		onRightClick={val => props.onRightClick(val)}
  		>
  			{props.mainMarker}
  			{props.secondaryMarker}
  			{props.nearestPoints}
  			{props.nearestStops}
  			{props.nearestConnection}
  			{props.showLink}
  		</GoogleMap>
	)



class MapComponent extends React.Component {


	handleClick (val) {

		this.props.changeMarkerPosition({
			lon: val.latLng.lng(),
			lat: val.latLng.lat()
		})


	}

	handleRightClick (val) {
		this.props.changeSecondaryMarker({
			lon: val.latLng.lng(),
			lat: val.latLng.lat()
		})

	}


	render () {
		const { props:P } = this

		console.log('MapComponent', this)

		return (

			<div>
				<MyMapComponent 
					onClick={val => this.handleClick(val)}
					onRightClick={val => this.handleRightClick(val)}
					mainMarker={P.mainMarker.react}
					secondaryMarker={P.secondaryMarker.react}
					nearestPoints={P.nearestPoints}
					nearestStops={P.nearestStops}
					nearestConnection={P.nearestConnection.react}
					showLink={P.showLink}
				/>
			</div>

		)

	}
}



const mapStateToProps = state => {
	return {
		mainMarker: state.mainMarker,
		secondaryMarker: state.secondaryMarker,
		nearestPoints: makePointsObjects(state.nearestChosen.items),
		nearestStops: drawNearestStops(state.nearestStops.items),
		nearestConnection: {
			react: makeNearestConnection(state.nearestConnection.items),
			data: state.nearestConnection
		},
		showLink: makeShowLink(state.showLink)
	}
}


const mapActionsToProps = dispatch => {
	return {
		changeMarkerPosition: (obj) => dispatch(A.changeMainMarker(obj)),
		changeSecondaryMarker: obj => dispatch(A.changeSecondaryMarker(obj)),
		fetchNearestChosen: () => {}
	}
}


export default connect(mapStateToProps, mapActionsToProps)(MapComponent)