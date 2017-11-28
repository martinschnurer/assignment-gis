import React from 'react'
import PT from 'prop-types'
import { Grid, Col, Row, Table } from 'react-bootstrap'
import { SelectField, MenuItem, Checkbox, RaisedButton } from 'material-ui'
import { connect } from 'react-redux'
import A from 'src/actions'
import Slider from 'react-rangeslider'



import 'react-rangeslider/lib/index.css'
import './style.css'


function fetchAllLinks () {
	return new Promise((resolve, reject) => {
		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: `{
  						mhdLinks {
    							relation_id
    							name
							}
						}`,
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			resolve(json.data.mhdLinks)
		})		
	})
}


function fetchData (what) {
	return new Promise ((resolve, reject) => {

		fetch('http://localhost:3001/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					operationName: null,
					query: `{ ${what} }`,
					variables: null
				}
			)
		})
		.then(data => data.json())
		.then(json => {
			resolve(json)
		})
			
	})
}



class Controller extends React.Component {
	constructor () {
		super()
		this.state = {
			firstSelect: 'amenities',
			secondSelect: '',
			amenities: [],
			shops: [],
			mhdLinks: []
		}
	}

	componentDidMount () {
		const promises = [fetchData('amenities'), fetchData('shops'), fetchAllLinks()]
		
		Promise.all(promises).then(values => {
			this.setState({
				amenities: values[0].data.amenities.sort((a, b) => a.localeCompare(b)),
				shops: values[1].data.shops.sort((a, b) => a.localeCompare(b)),
				mhdLinks: values[2]
			})
		})
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.secondSelectData !== nextProps.secondSelectData) {
			this.setState({
				secondSelect: nextProps.secondSelectData.length > 0 ? nextProps.secondSelectData[0] : ''
			})
		}
	}

	handleFirstChange(val) {
		this.setState({
			firstSelect: val
		})	

		this.props.onFirstChange(val)	
	}

	handleLinkClick (relation_id) {
		this.props.chooseLink(relation_id)
	}


	handleSecondSelectChange (val) {
		this.setState({
			secondSelect: val
		})

		this.props.setSecondSelect(val)
	}


	render () {
		console.log(this)
		const { props: P, state: S} = this

		let secondSelectOptions 

		if (P.firstSelect === 'shops') {
			secondSelectOptions = S.shops.map(item => <MenuItem key={item} value={item} primaryText={item}/>)
		} else {
			secondSelectOptions = S.amenities.map(amen => <MenuItem key={amen} value={amen} primaryText={amen}/>)
		}


		return (

			<Grid>
				<Row>
					<Col md={8}>
						<div>
							<SelectField 
								floatingLabelText="Choose" 
								value={P.firstSelect}
								onChange={(e, i, val) => P.setFirstSelect(val)}
							>
								<MenuItem value={'shops'} primaryText="Shops" />
								<MenuItem value={'amenities'} primaryText="Amenities" />
							</SelectField>
							
							<SelectField
								style={{marginLeft: 15}}
								floatingLabelText="Choose"
								value={S.secondSelect}
								onChange={(e, i, val) => this.handleSecondSelectChange(val) }
							>
								{secondSelectOptions}
							</SelectField>
						</div>
						<Row>
							<Col sm={2}><h4>Radius</h4></Col>
							<Col sm={11}>
								<Slider
									onChange={value => P.setRangeValue(value)}
									min={20}
									max={1000}
									step={50}
									value={P.rangeValue}
									tooltip
								/>
							</Col>
						</Row>
						<div style={{paddingTop: 50}}>
							<RaisedButton
								style={{marginLeft: 5}} 
								label={`Show nearest ${P.secondSelect}`} 
								disabled={P.secondSelect === ''}
								onClick={() => P.fetchNearest()}
								primary 
							/>
							<RaisedButton
								style={{marginLeft: 5}} 
								label="Show nearest stops and amenities to them"
								onClick={() => P.showNearestStops()}
								primary
							/>
							<RaisedButton
								style={{marginLeft: 5}} 
								label="Connect two people"
								disabled={!P.isSecondaryMarker}
								onClick={() => P.fetchNearestConnection()}
								primary
							/>
							<div className="scrollable">
								
							</div>
						</div>
						<div style={{paddingTop: 15}}>
							{
								P.isNearestLoaded && (
									<RaisedButton 
										onClick={() => P.hideNearestChosen()}
										label={`Hide nearest ${P.secondSelect}`} 
										secondary={true}
									/>
							)}
						</div>
					</Col>

					<Col md={4}>
						<div className="scrollable">
							<Table style={{marginTop: 15}}>
								<thead>
									<tr>
										<th>Link</th>
									</tr>
								</thead>
								<tbody>
									{
										S.mhdLinks.map(link => (
											<tr 
												style={{cursor: 'pointer'}}
												key={link.name}
												onClick={() => P.showLink(link.relation_id)}
											>
												<span>{link.name}</span>
											</tr>
										))
									}
								</tbody>
							</Table>
						</div>
					</Col>
				</Row>
			</Grid>
		)

	}

}



const mapStateToProps = state => {
	
	return {
		showAllLinks: {links:[]},
		nearestLinks: [],
		allLinks: {links: []},
		secondSelectOptions: [],
		firstSelect: state.select.firstSelect,
		secondSelect: state.select.secondSelect,
		rangeValue: state.rangeValue,
		isNearestLoaded: state.nearestChosen.items.length > 0,
		isSecondaryMarker: state.secondaryMarker.coordinates !== null,
		nearestConnection: state.nearestConnection
	}
}


const mapActionsToProps = dispatch => {
		
	return {
		setFirstSelect: value => dispatch(A.setFirstSelect(value)),
		setSecondSelect: value => dispatch(A.setSecondSelect(value)),
		fetchNearest: value => dispatch(A.fetchNearest()),
		showNearestStops: () => dispatch(A.showNearestStops()),
		setRangeValue: value => dispatch(A.setRangeValue(value)),
		hideNearestChosen: () => dispatch(A.hideNearest()),
		fetchNearestConnection: () => dispatch(A.connectTwoPeople()),
		showLink: (link) => dispatch(A.showLink(link))
	}
}



export default connect(mapStateToProps, mapActionsToProps)(Controller)



