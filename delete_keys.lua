
local cursor="0";
local count = 0;

if (not ARGV[1]) then 
    return "Usage: redis-cli --eval delete_keys.lua , my_prefix"
end 

local prefix = ARGV[1] .. '*'

repeat
 local scanResult = redis.call("SCAN", cursor, "MATCH", prefix, "COUNT", 100);
	local keys = scanResult[2];
	for i = 1, #keys do
		local key = keys[i];		
        redis.call("DEL", key);
		count = count +1;
	end;
	cursor = scanResult[1];
until cursor == "0";
return "Total "..count.." keys Deleted" ;

--
-- Ways to delete multiple keys from Redis cache.
-- https://medium.com/geekculture/how-to-delete-multiple-keys-from-redis-cache-252275a95579
-- 
-- Passing arguments to redis-cli
-- https://stackoverflow.com/questions/39516525/passing-arguments-to-redis-cli
-- 
-- Call with: 
-- redis-cli --eval delete_keys.lua , my_prefix 
-- 
