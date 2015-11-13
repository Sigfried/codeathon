set search_path = 'hospital_dq';
create index on denorm (dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6,measure_name);
create index on denorm (dimsetset, measure_id, set_id);
create index on dimension_set (dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6);




select dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6, count(*) as cnt,
		count(distinct(measure_name)) as measures
from denorm
group by dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6
order by 1,2,3,4,5,6 desc


select '', null, coalesce('', null)


select dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6, count(*)
from dimension_set
group by dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6
order by 1,2,3,4,5,6 desc

SELECT * from denorm  WHERE dimsetset like 'condition_concept_id,calendar_year,gender_concept_id%'

select dimsetset,

select measure_name, result_name, dimsetset, count(*), min(value), max(value)--, avg(value::float), sum(value::float)
from denorm
group by measure_name,result_name, dimsetset
order by 1,2,3

select '' as '' from denorm where dimsetset like '%age_group%'


select  dimsetset, count(*) as records, count(distinct set_id) as sets from denorm  group by dimsetset



SELECT * FROM denorm WHERE dimsetset = 'calendar_month'

/*

update pcornet_dq.dimension_set set dim_name_1 = null where dim_name_1 like 'emptyfield%';
update pcornet_dq.dimension_set set dim_name_2 = null where dim_name_2 like 'emptyfield%';
update pcornet_dq.dimension_set set dim_name_3 = null where dim_name_3 like 'emptyfield%';
update pcornet_dq.dimension_set set dim_name_4 = null where dim_name_4 like 'emptyfield%';
update pcornet_dq.dimension_set set dim_name_5 = null where dim_name_5 like 'emptyfield%';
update pcornet_dq.dimension_set set dim_name_6 = null where dim_name_6 like 'emptyfield%';

create index on pcornet_dq.dimension_set (
dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6)
*/
