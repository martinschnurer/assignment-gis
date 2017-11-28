module.exports = `
	type Link {
		# Id of Whole relation
		relation_id: Int!

		# bus start stop
		from: String
		
		# bus end stop
		to: String

		# Number of MHD link.. for example (39,31,94...N139)
		ref: String

		# full name of link , for Example:(Bus 39: Cintorin Slavicie Udolie => Suhvezdna)
		name: String

		# type of mhd
		route: String


		lines: [LineString]

		stops: [Interest]
	}
`