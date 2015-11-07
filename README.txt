
cd codeathon
npm install # might need to run 'npm install less' and 'npm install less-loader' first
export DATABASE_URL=postgres://postgres@localhost:5432/postgres
cd data
gunzip -c sqldata/chco_dq_denorm.sql.gz > sqldata/chco_dq_denorm.sql
gunzip -c sqldata/ms_dq_denorm.sql.gz > sqldata/ms_dq_denorm.sql
gunzip -c sqldata/pcornet_dq_denorm.sql.gz > sqldata/pcornet_dq_denorm.sql
gunzip -c sqldata/phis_dq_denorm.sql.gz > sqldata/phis_dq_denorm.sql
gunzip -c sqldata/synpuf_dq_denorm.sql.gz > sqldata/synpuf_dq_denorm.sql
sh ./dataload.sh phis_dq
sh ./dataload.sh pcornet_dq
sh ./dataload.sh ms_dq
sh ./dataload.sh chco_dq
sh ./dataload.sh synpuf_dq
cd ..
npm start
