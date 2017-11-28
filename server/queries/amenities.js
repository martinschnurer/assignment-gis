module.exports = `
	SELECT DISTINCT(amenity) 
	FROM planet_osm_point 
	WHERE amenity IS NOT NULL
`