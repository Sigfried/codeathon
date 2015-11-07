
psql -U postgres -d dqc_codeathon -c "drop schema if exists ${1} cascade"
psql -U postgres -d dqc_codeathon < ./sqldata/${1}_denorm.sql
