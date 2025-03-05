Here’s a **README.md** file for your Node.js cluster-based load balancer project. This file provides an overview of the project, how to set it up, and how to use it.

---

# **Node.js Cluster-Based Load Balancer**

This project demonstrates a simple **load balancer** using Node.js's `cluster` module. It distributes incoming HTTP requests across multiple worker processes, leveraging all available CPU cores for better performance. It also includes a health check mechanism to monitor worker processes and restart them if they become unresponsive.

---

## **Features**
- **Multi-Core Support**: Utilizes all available CPU cores using the `cluster` module.
- **Health Checks**: Regularly monitors worker processes and restarts them if they fail.
- **Load Distribution**: Distributes incoming requests across worker processes.
- **Express.js Backend**: Uses Express.js to handle HTTP requests.

---

## **Prerequisites**
- Node.js installed (v14 or higher)
- NPM (Node Package Manager)

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install express
   ```

---

## **Usage**

1. Start the application:
   ```bash
   node load.js
   ```

2. Open your browser or use `curl` to test the endpoints:
   - **Root Endpoint**:
     ```bash
     curl http://localhost:3005
     ```
     Example response:
     ```
     Hello from worker 12345
     ```

   - **Health Check Endpoint**:
     ```bash
     curl http://localhost:3005/health
     ```
     Example response:
     ```
     OK
     ```

   - **CPU-Intensive Task Endpoint**:
     ```bash
     curl http://localhost:3005/heavy
     ```
     Example response:
     ```
     Value of total is 45. Heavy task completed by worker 12345
     ```

3. Observe the logs in the terminal to see how the master process manages worker processes and performs health checks.

---

## **How It Works**

### **Master Process**
- The master process forks worker processes equal to the number of CPU cores available.
- It periodically performs health checks on each worker process.
- If a worker process becomes unresponsive, it is killed, and a new worker is forked.

### **Worker Process**
- Each worker process runs an Express.js server on port `3005`.
- Handles incoming HTTP requests and distributes the load.
- Includes a `/health` endpoint for health checks and a `/heavy` endpoint to simulate CPU-intensive tasks.

---

## **Health Check Mechanism**
- The master process sends an HTTP GET request to the `/health` endpoint of each worker process every 5 seconds.
- If a worker responds with a status code of `200`, it is considered healthy.
- If a worker fails to respond or returns an error, it is killed, and a new worker is forked.

---

## **Project Structure**
```
your-repo/
├── load.js                # Main application file
├── README.md             # Project documentation
└── package.json          # NPM dependencies and scripts
```

---

## **Dependencies**
- [Express.js](https://expressjs.com/): A fast, unopinionated web framework for Node.js.
- Node.js `cluster` module: Used to create worker processes.

---

## **Contributing**
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

