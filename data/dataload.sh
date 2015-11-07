
psql -U postgres -d postgres -c "drop schema if exists $1 cascade";
psql -U postgres -d postgres < ./sqldata/${1}_denorm.sql
