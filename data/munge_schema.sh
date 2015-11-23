
(echo "set search_path='$1';" && cat ./munge_schema_1.sql) | psql

psql < ./datasets/$1.sql

echo "running: node dqcdm_munge.js $1"

node dqcdm_munge.js $1

echo "done with dqcdm_munge.js"

path=`pwd`
psql -c "set search_path=$1; COPY dimensions_regular FROM '$dir/data/${1}.dimensions_regular.tsv';"
psql -c "set search_path=$1; COPY results_regular FROM '$dir/data/${1}.results_regular.tsv';"

(echo "set search_path='$1';" && cat ./munge_schema_2.sql) | psql
