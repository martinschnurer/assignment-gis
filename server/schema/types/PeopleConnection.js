module.exports = `
	
	type PeopleConnection {

		# All lines making relation (from first person perspective)
		firstRelation: [LineString]
		
		# All lines making relation (from second person perspective)
		secondRelation: [LineString]

		# Place, where two people should meet
		amenity: Interest

		firstGetOn: Interest
		firstGetOut: Interest
		
		secondGetOn: Interest
		secondGetOut: Interest

		firstRelationMeta: Link
		secondRelationMeta: Link
	}

`