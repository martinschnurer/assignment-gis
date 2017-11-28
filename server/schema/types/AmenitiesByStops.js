module.exports = `
	type AmenitiesByStops {
		
		# I am at FIIT university and I want to find 3 nearest stops to me. It is possible, that query return 3 times same bus stop - this is because in this stop, there is stop position for more links - for example 39,31,N31 so it return 3 times bus stop 'Televizia' because there are 3 distinct links going from this stop. 
		nearestStops: Interest
		
		# All lines (GeojSONS) of all link
		lines: [LineString]
		
		# All amenities/shops in radius 'distance'. Default distance is 100m. You can change distance with parameter distanceFromStop
		amenities: [Interest]
		
		# Stops are type of Interest because has its name and geo location
		stops: [Interest]

		relation: Link
	}
`