psql -U postgres -d postgres -c 'drop table if exists denorm;'
psql -U postgres -d postgres -c 'drop table if exists dimension_set;'
psql -U postgres -d postgres -c 'drop table if exists measure;'
psql -U postgres -d postgres -c 'drop table if exists result;'

pg_restore  -Upostgres dqcdm_data.backup > dqcdm.schema.from.backup.sql

sed -i -e 's/SET search_path = phis, pg_catalog;/--SET search_path = phis, pg_catalog;/' dqcdm.schema.from.backup.sql

psql -U postgres -d postgres < dqcdm.schema.from.backup.sql

#psql -U postgres -d postgres -c 'create table denorm as select r.result_name,r.value,d.*,m.* from result r join dimension_set d on r.set_id=d.set_id join measure m on r.measure_id=m.measure_id;'
#psql -U postgres -d postgres -c "copy denorm to '/Users/sigfried/Sites/codeathon/dq.denorm.csv' delimiter ',' csv header;"

psql -U postgres -d postgres < munge_tables.sql;

node dqcdm_munge.js

#node denorm.js dq.denorm.csv > dq.json
