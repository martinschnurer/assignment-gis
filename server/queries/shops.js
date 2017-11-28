module.exports = `
	SELECT DISTINCT(tags-> 'shop') as shops
	FROM planet_osm_point 
	WHERE tags-> 'shop' IS NOT NULL
`