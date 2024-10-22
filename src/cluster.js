import cluster from 'cluster'
import http from 'http'
import os from 'os'

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });
} else {
  // Workers can share any TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  }).listen(3000);

  console.log(`Worker ${process.pid} started`);
}

/*
   How to Scale a Nodejs Application
   https://habtesoft.medium.com/how-to-scale-a-nodejs-application-2c324587ab89
*/