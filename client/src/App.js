import React, { Component } from 'react';
import Controller from 'src/Controller'
import MapComponent from 'src/MapComponent'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getAmenities from 'src/queries/amenities'
import getShops from 'src/queries/shops'

import getNearestLinks, {getGoogleMapArray} from 'src/queries/nearestLinks'

const obj = {
    'shops': () => {
        return getShops()
    },
    'amenities': () => {
        return getAmenities();
    }
}

class App extends Component {
    constructor () {
        super()
        this.state = {
            data: {
                points: [],
                lines: []
            },
            secondSelectData: [],
            mainMarker: {lat: 48.1532073, lng: 17.1069213},
            showLinksOnMap: true,
            nearestLinks: [],
            chosenLink: []
        }
    }


    handleMapClick (val) {
        
        this.setState({
            mainMarker: {
                lat: val.latLng.lat(),
                lng: val.latLng.lng()
            }
        })

        getNearestLinks({
            lat: val.latLng.lat(),
            lng: val.latLng.lng(),
            lon: val.latLng.lng()
        }).then(data => {
            this.setState({
                links: data.links
            })
        })

    }

    handleChooseLink (id) {
        let arr = getGoogleMapArray(id)
        
        this.setState({
            chosenLink: arr
        })
    } 


    handleFirstChange (val) {
        obj[val]().then(data => {
            console.log(data)
            this.setState({
                secondSelectData: data
            })
        }).catch(err => console.log(err))
    }

    render() {
        const {props:P, state:S} = this
        
        return (
            <MuiThemeProvider>
                <div className="App">
                    <Controller />
                    <MapComponent />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;