const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const Link = require('./types/Link.js');
const Point = require('./types/Point');
const Shop = require('./types/Shop')
const Amenity = require('./types/Amenity')
const Interest = require('./types/Interest')
const AmenitiesByStops = require('./types/AmenitiesByStops')
const LineString = require('./types/LineString')
const PeopleConnection = require('./types/PeopleConnection')

const SchemaDefinition = `
	
	type Query {

		# Get all mhd links in Bratislava
		mhdLinks(id: Int): [Link]!
		
		# Get all amenities (coffee, taxi, ATM and so on...)
		amenities: [String]!
		
		# Get all shops with different purposes
		shops: [String]!

		# Get nearest Interest
		nearestInterests(type: String!, lat: Float!, lng: Float!, inArea: Float): [Interest]

		# Connect two people, they meet at chosen amenity 
		connectTwoPeople(
			first_lng: Float! 
			first_lat: Float! 
			second_lng: Float! 
			second_lat: Float! 
			type: String!
		): [PeopleConnection]

		# It is possible, that this query doesnt return nearest\
		amenities by stops at all. For Example if you set \
		distanceFromStop to 0, than of course, no "Bar" is\
		so near to any existing stop. - so in this case, amenities\
		will be empty array
		getAmenitiesByStops(lat: Float!, lng: Float!, type: String!, distanceFromStop: Float): [AmenitiesByStops]
		
	}
	schema {
		query: Query
	}
	
`;

module.exports = makeExecutableSchema({
	typeDefs: [SchemaDefinition, Point, LineString, Link, Interest, AmenitiesByStops, PeopleConnection],
	resolvers,
});
