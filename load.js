const cluster=require('cluster');
// cluster module is the module used to create child proces that share same server port
// distribute workload acreoss various ervers
const os=require('os');
const express=require('express');
const http = require('http');
// Master process is used for managing worker process
if(cluster.isMaster){
    console.log(`Master process is running with PID:${process.pid}`);
    const numCPUs=os.cpus().length;
    console.log(`Forking for ${numCPUs} CPUs...`)

    for(let i=0;i<numCPUs;i++){
        cluster.fork();
    }
    const healthCheck=(worker)=>{
        const options={
            hostname:'localhost',
            port:3005,
            path:'/health',
            method:'GET'
        }
        const req=http.request(options,(res)=>{
            if(res.statusCode===200){
                console.log(`Worker ${worker.process.pid} is heathy`);
            }
            else{
                console.log(`Worker ${worker.process.pid} is unheathy`)
                worker.kill();
                cluster.fork();
            }
        })
        req.on('error',(err)=>{
            console.log(`Worker ${worker.process.pid} is unheathy:${err.message}`);
            worker.kill();
            cluster.fork();
        })
        req.end();
    };
    setInterval(()=>{
        for(const id in cluster.workers){
            healthCheck(cluster.workers[id]);
        }
    },5000)
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });
}
else{
    const app=express();
    app.get('/', (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
      });
      app.get('/health', (req, res) => {
        res.status(200).send('OK');
      });
      // Simulate a CPU-intensive task
      app.get('/heavy', (req, res) => {
        let total = 0;
        for (let i = 0; i < 10; i++) {
          total += i;
        }
        res.send(`Value of total is ${total}. Heavy task completed by worker ${process.pid}`);
      });
    
      // Start the server on port 3000
      const PORT = 3005;
      app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
      });
}