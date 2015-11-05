
cd codeathon
npm install
export DATABASE_URL=postgres://postgres@localhost:5432/postgres
cd data
sh ./munge_schema.sh phis_dq
cd ..
npm start
