module.exports = `
	select 
		r.key,
		r.value,
		r.name, 
		r.type, 
		hstore_to_matrix(coalesce(p.tags, l.tags)) as tags,
		coalesce(st_asgeojson(st_transform(p.way,4326)), st_asgeojson(st_transform(l.way,4326))) as way 
	FROM relations r
	LEFT JOIN planet_osm_point p on p.osm_id=r.ref
	LEFT JOIN planet_osm_line l on l.osm_id=r.ref
	WHERE relation_id=$1::bigint
`

/*
select r.key, r.value, r.name, r.type, hstore_to_matrix(coalesce(p.tags, l.tags)) as tags,coalesce(st_asgeojson(st_transform(p.way,4326)), st_asgeojson(st_transform(l.way,4326))) as way from relations r
left join planet_osm_point p on p.osm_id=r.ref
left join planet_osm_line l on l.osm_id=r.ref
where relation_id=129352
*/