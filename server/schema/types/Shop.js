
const Shop = `
	type Shop {
		id: ID!
		name: String
		geojson: Point
		distance: Float
	}
`

module.exports = () => [Shop]