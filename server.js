const cluster = require('cluster');
const os = require('os');
const process = require('process');

// Load environment variables in non-production environments
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require('.'); 
const PORT = process.env.PORT || 3000;
const numCPUs = Math.min(os.cpus().length, 4); // Use up to 4 CPUs

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker');
    cluster.fork(); // Fork a new worker if one dies
  });

  
} else {
  // Workers can share any TCP connection
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}
