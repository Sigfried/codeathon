
cd codeathon
npm install # might need to run 'npm install less' and 'npm install less-loader' first
export DATABASE_URL=postgres://postgres@localhost:5432/postgres
cd data
gunzip *
sh ./dataload.sh phis_dq
sh ./dataload.sh pcornet_dq
sh ./dataload.sh ms_dq
sh ./dataload.sh chco_dq
sh ./dataload.sh synpuf_dq
cd ..
npm start
