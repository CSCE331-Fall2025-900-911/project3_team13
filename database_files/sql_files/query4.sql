SELECT COUNT(*) FROM transactions 
WHERE NOW() - interval '1 month' <= timestamp AND timestamp <= NOW();