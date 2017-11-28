const pool = require('connectionPool')

const q = `
WITH numbered_relations AS (
	SELECT *, row_number() OVER(PARTITION BY relation_id) FROM relations
),
nearest_stops AS ( -- nearest stops from point, VRATI VZDY IBA N ODLISNYCH STOP POSITION ZASTAVOK
	SELECT
		DISTINCT(r.relation_id),
		p.osm_id,
		st_distance(st_transform(p.way, 4326)::geography, st_setsrid(st_makepoint($1::float, $2::float), 4326)::geography) as distance_from_point,
		st_asgeojson(st_transform(p.way, 4326))::jsonb,
		p.tags,
		row_number
	FROM numbered_relations r
	JOIN planet_osm_point p ON p.osm_id = r.ref 
	WHERE p.tags->'public_transport'='stop_position'
	ORDER BY distance_from_point asc
	LIMIT 3 -- toto najde 3 najblizsie zastavky
), 
all_stop_positions AS ( -- TOTO K TYM 3 NAJBLIZSIM ZASTAVAM VYBERIE VSETKY OSTATNE ZASTAVKY, KTORE IDU PO CESTE S LINKAMI OD TEJ DANEJ ZASTAVKY
	SELECT 
		p.osm_id, 
		p.way, st_asgeojson(st_transform(p.way,4326))::jsonb, 
		r.relation_id, 
		ns.row_number as OMG, 
		r.row_number,
		p.tags->'name' as name
	FROM numbered_relations r
	JOIN planet_osm_point p ON p.osm_id = r.ref
	JOIN nearest_stops ns ON r.relation_id = ns.relation_id
	WHERE (p.tags->'public_transport'='stop_position')
), 
nearest_amenities AS (

	SELECT * FROM (SELECT tmp.*, row_number() OVER(PARTITION BY osm_id) FROM (
		SELECT 
			distinct(ns1.osm_id),
			st_distance(st_transform(pop.way, 4326)::geography, st_transform(ns1.way, 4326)::geography),
			st_asgeojson(st_transform(pop.way,4326))::jsonb,
			pop.name as name
		FROM all_stop_positions ns1
		CROSS JOIN planet_osm_point pop
		WHERE 
		    st_distance(st_transform(pop.way, 4326)::geography, st_transform(ns1.way, 4326)::geography) < $4::float
		  AND 
		    ns1.row_number >= ns1.omg
		  AND 
		    (pop.tags->'amenity'=$3::text OR pop.tags->'shop'=$3::text)
	) tmp ) tmp2
	WHERE tmp2.row_number < 5
)
	SELECT 
		q1.relation_id, 
		q1.st_asgeojson as nearest_stops,
		q1.tags->'name' as nearest_stop_name,
		row_to_json(q2)::jsonb as amenities,
		row_to_json(q3)::jsonb  as stops
	FROM nearest_stops q1
	CROSS JOIN (SELECT array_to_json(array_agg(nearest_amenities))::jsonb as nearest_amenities FROM nearest_amenities) q2
	CROSS JOIN (SELECT array_to_json(array_agg(all_stop_positions))::jsonb as all_stop_positions FROM all_stop_positions) q3
`



function nearestAmenities (_, args) {

	const { lat, lng, type, distanceFromStop = 100 } = args // get parameters

	return new Promise((resolve, reject) => {

		pool.connect((err, client, release) => {
			client.query(q, [lng, lat, type, distanceFromStop], (err, result) => {
				release()

				if (err) {
					console.log(err)
					reject(err)
				}

				const result_arr = result.rows.map(row => {
					return {
						relation_id: row.relation_id,
						nearestStops: {
							name: row.nearest_stop_name,
							distance: 0,
							geojson: {
								lng: row.nearest_stops.coordinates[0],
								lat: row.nearest_stops.coordinates[1]
							}
						},
						// lines: row.lines.coordinates.map(couple => ({lng: couple[0], lat: couple[1]})),
						amenities: row.amenities.nearest_amenities ? row.amenities.nearest_amenities.map(amenity => {
							return {
								name: amenity.name,
								distance: amenity.st_distance,
								geojson: {
									lng: amenity.st_asgeojson.coordinates[0],
									lat: amenity.st_asgeojson.coordinates[1]	
								}
							}
						}) : [],
						stops: row.stops.all_stop_positions.map(stop => {
							return {
								name: stop.name,
								distance: stop.distance,
								geojson: {
									lng: stop.st_asgeojson.coordinates[0],
									lat: stop.st_asgeojson.coordinates[1],
								}
							}
						})
					}
				})

				resolve(result_arr)
			})
		})

	})
	

}

module.exports = nearestAmenities