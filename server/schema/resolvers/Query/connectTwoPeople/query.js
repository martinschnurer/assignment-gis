module.exports = `
with only_mhd as (
  select *
  from relations  
  where relation_id in (select distinct(relation_id) from relations WHERE value='MHD Bratislava')
  and relation_id not in (select distinct(relation_id) from relations WHERE key='ref' and value like 'N%')
),
numbered_stops as (
  select pop.tags, pop.name, pop.way, r.*, row_number() over(partition by relation_id) 
  from only_mhd r
  join planet_osm_point pop ON pop.osm_id = r.ref
  where role in ('stop','stop_entry_only')
),
interest as (
  select 
    name as "i-name", 
    way as "i-way",
    osm_id as "i-osm_id"
  from planet_osm_point pop where pop.tags->'amenity' = $5::text
),
stop_to_interest as ( -- VYBERIE NAJBLIZSIE INTERESTING V OKOLI 500 METROV OD KAZDEJ ZASTAVY
  select 
    st_distance(st_transform(i."i-way", 4326)::geography, st_transform(ns.way, 4326)::geography), 
    ns.way as "sti-way",
    ns.tags->'name' as "sti-name",
    ns.relation_id as "sti-relation_id",
    ns.row_number as "sti-row_number",
    i.*
  from numbered_stops ns 
  join interest i on st_distance(st_transform(i."i-way", 4326)::geography, st_transform(ns.way, 4326)::geography) < 500
  order by st_distance asc
),
nearest_stop_1 as (
  select 
    st_distance(st_transform(from_point.way, 4326)::geography, st_transform(ns.way, 4326)::geography), 
    ns.row_number as "ns1-row_number",
    ns.tags->'name' as "ns1-name",
    ns.way as "ns1-way",
    ns.relation_id as "ns1-relation_id"
  from numbered_stops ns
  cross join (select st_setsrid(st_makepoint($1::float, $2::float), 4326) as way) as from_point
  where st_distance(st_transform(from_point.way, 4326)::geography, st_transform(ns.way, 4326)::geography) < 500
  order by st_distance asc
),
nearest_stop_2 as (
  select 
    st_distance(st_transform(from_point.way, 4326)::geography, st_transform(ns.way, 4326)::geography),
    ns.row_number as "ns2-row_number",
    ns.tags->'name' as "ns2-name",
    ns.way as "ns2-way",
    ns.relation_id as "ns2-relation_id"
  from numbered_stops ns
  join (select st_setsrid(st_makepoint($3, $4), 4326) as way) from_point on true
  where st_distance(st_transform(from_point.way, 4326)::geography, st_transform(ns.way, 4326)::geography) < 500
  order by st_distance asc
),
first_person as (
  select 
  	  (ns1.st_distance + sti.st_distance) as total_distance, 
	  ns1."ns1-relation_id",
	  ns1."ns1-name",
	  st_asgeojson(st_transform(ns1."ns1-way",4326))::jsonb as "ns1-way",
	  
	  sti."sti-name" as "sti-1-name",
	  st_asgeojson(st_transform(sti."sti-way", 4326))::jsonb as "sti-1-way",
	  sti."i-name",
	  sti."i-osm_id",
	  st_asgeojson(st_transform(sti."i-way", 4326))::jsonb as "i-way"
  from nearest_stop_1 ns1
  join stop_to_interest sti ON (ns1."ns1-relation_id" = sti."sti-relation_id" AND sti."sti-row_number" > ns1."ns1-row_number")
),
second_person as (
  select 
    (ns2.st_distance + sti.st_distance) as total_distance, 
    ns2."ns2-relation_id",
    ns2."ns2-name",
    st_asgeojson(st_transform(ns2."ns2-way", 4326))::jsonb as "ns2-way",
	  
    sti."sti-name" as "sti-2-name",
    sti."i-osm_id",
    st_asgeojson(st_transform(sti."sti-way", 4326))::jsonb as "sti-2-way"
  from nearest_stop_2 ns2
  join stop_to_interest sti ON (ns2."ns2-relation_id" = sti."sti-relation_id" AND sti."sti-row_number" > ns2."ns2-row_number")
)
select  
	fp.total_distance + sp.total_distance as abs_total_distance,
	*
from first_person as fp
join second_person sp on fp.total_distance + sp.total_distance < 500 and fp."i-osm_id"=sp."i-osm_id"
order by fp.total_distance + sp.total_distance  asc
limit 1
`