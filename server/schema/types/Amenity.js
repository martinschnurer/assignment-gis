
const Amenity = 
`
	type Amenity {
		id: ID!
		distance: Float
		name: String
		geojson: Point
	}
`
module.exports = Amenity