#psql -U postgres -d postgres -c "drop table if exists $1.dimension_set;"
#psql -U postgres -d postgres -c "drop table if exists $1.measure;"
#psql -U postgres -d postgres -c "drop table if exists $1.result;"
#
#psql -U postgres -d postgres < ./sqldata/$1.sql

psql -U postgres -d postgres -c "drop table if exists $1.denorm;"
psql -U postgres -d postgres -c "drop table if exists $1.dimensions_regular;"
psql -U postgres -d postgres -c "drop table if exists $1.results_regular;"
psql -U postgres -d postgres -c "drop table if exists $1.denorm;"

node dqcdm_munge.js $1
