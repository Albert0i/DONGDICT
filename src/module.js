import Redis from "ioredis"
const redis = new Redis( {
  port: 7000, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "",
  db: 0, // Defaults to 0
} );

const key = 'user:1000';
    const jsonData = {
        name: 'John Doe',
        age: 30,
        country: 'USA',
    };

async function main() {
  // Redis#call() can be used to call arbitrary Redis commands.
  // The first parameter is the command name, the rest are arguments.
  
  // await redis.call("JSON.SET", "doc", "$", '{"f1": {"a":1}, "f2":{"a":2}}');
  // const json = await redis.call("JSON.GET", "doc", "$..f1");
  // console.log(json); // [{"a":1}]

  await redis.call("JSON.SET", key, "$", JSON.stringify(jsonData))
  const json = await redis.call("JSON.GET", key);
  console.log(json); // [{"a":1}]
}

main();

/*
   ioredis 
   https://github.com/redis/ioredis/blob/main/examples/module.js
*/