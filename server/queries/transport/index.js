module.exports = `
	select relation_id, value 
	from relations  
	where 
		value like 'Bus %: % => %' 
		or 
		value like 'Tram % => %'
`