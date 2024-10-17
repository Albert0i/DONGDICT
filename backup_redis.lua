-- Lua script to backup Redis data by pattern
local pattern = ARGV[1]  -- The pattern to search for
local output = {}  -- Table to hold backup commands

-- Function to scan keys and generate backup commands
local function scan_keys(pattern)
    local cursor = "0"
    repeat
        local result = redis.call("SCAN", cursor, "MATCH", pattern)
        cursor = result[1]
        local keys = result[2]

        for _, key in ipairs(keys) do
            local type = redis.call("TYPE", key).ok

            if type == "string" then
                local value = redis.call("GET", key)
                table.insert(output, string.format("SET \"%s\" \"%s\"", key, value))
            elseif type == "list" then
                local values = redis.call("LRANGE", key, 0, -1)
                for _, value in ipairs(values) do
                    table.insert(output, string.format("RPUSH \"%s\" \"%s\"", key, value))
                end
            elseif type == "set" then
                local members = redis.call("SMEMBERS", key)
                for _, member in ipairs(members) do
                    table.insert(output, string.format("SADD \"%s\" \"%s\"", key, member))
                end
            elseif type == "hash" then
                local fields = redis.call("HGETALL", key)
                for i = 1, #fields, 2 do
                    table.insert(output, string.format("HSET \"%s\" %s \"%s\"", key, fields[i], fields[i + 1]))
                end
            elseif type == "zset" then
                local members = redis.call("ZRANGE", key, 0, -1, "WITHSCORES")
                for i = 1, #members, 2 do
                    table.insert(output, string.format("ZADD \"%s\" \"%s\" \"%s\"", key, members[i + 1], members[i]))
                end
            end
        end
    until cursor == "0"
end

-- Start scanning keys with the provided pattern
scan_keys(pattern)

-- Return the backup commands
return table.concat(output, "\n")

--
-- redis-cli -h 127.0.0.1 -p 7000 --eval backup_redis.lua , "*" > output.txt 
-- 