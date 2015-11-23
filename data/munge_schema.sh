
(echo "set search_path='$1';" && cat ./munge_schema_1.sql) | psql

psql < ./datasets/$1.sql

echo "running: node dqcdm_munge.js $1"

node dqcdm_munge.js $1

(echo "set search_path='$1';" && cat ./munge_schema_2.sql) | psql
