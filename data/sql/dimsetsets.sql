select dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6, count(*)
from synpuf_dq.dimension_set
group by dim_name_1,dim_name_2,dim_name_3,dim_name_4,dim_name_5,dim_name_6
order by 7 desc
