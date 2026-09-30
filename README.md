# Welcome n8n

This is a very basic **n8n + Node.js Express** project for beginners who are learning n8n, just like me!

In this project, I have created a simple Express application that sends a request to an **n8n Webhook** and triggers a workflow.

The basic flow is:

```text
Client
   ↓
Node.js / Express
   ↓
n8n Webhook
   ↓
n8n Workflow
   ↓
Response
   ↓
Express
   ↓
Client
```

The purpose of this project is to understand how **Node.js/Express can communicate with n8n** and use n8n for workflow automation.

---

## Project Structure

```text
project-1/
│
├── controller/
│   └── welcome.controller.js
│
├── routes/
│   ├── index.js
│   └── welcome.route.js
│
├── node_modules/
│
├── .env
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

### Folder Explanation

#### `controller/`

Contains the business logic for the API.

```text
controller/
└── welcome.controller.js
```

The `welcome.controller.js` file:

* Receives the request from the client
* Validates the request
* Creates the payload
* Calls the n8n Webhook
* Receives the response from n8n
* Sends the response back to the client

---

#### `routes/`

Contains Express routes.

```text
routes/
├── index.js
└── welcome.route.js
```

`welcome.route.js` defines the welcome API endpoint.

Example:

```text
POST /api/v1/welcome/send-welcome
```

`index.js` is used to register application routes.

---

#### `server.js`

The main entry point of the Express application.

It:

* Creates the Express server
* Loads environment variables
* Registers middleware
* Registers routes
* Starts the server

---

#### `.env`

Contains environment variables such as the n8n Webhook URL.

Example:

```env
PORT=3000

N8N_WEBHOOK_URL=http://localhost:5678/webhook/welcome
```

For testing with the n8n Test URL:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/welcome
```

> Do not commit sensitive credentials or API keys to GitHub.

---

# Steps to Install n8n

## 1. Install Docker Desktop

Download and install Docker Desktop:

https://www.docker.com/products/docker-desktop/

Make sure Docker Desktop is running.

---

## 2. Run n8n using Docker

Run:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  docker.n8n.io/n8nio/n8n
```

On Windows PowerShell, you can use:

```powershell
docker run -it --rm --name n8n -p 5678:5678 docker.n8n.io/n8nio/n8n
```

After the container starts, open:

```text
http://localhost:5678
```

---

# Setting Up the n8n Workflow

Create a new workflow in n8n.

Add a:

```text
Webhook
```

node.

Configure it as:

```text
HTTP Method: POST
Path: welcome
Authentication: None
```

Set:

```text
Respond:
Using 'Respond to Webhook' Node
```

The Test URL will look like:

```text
http://localhost:5678/webhook-test/welcome
```

The Production URL will look like:

```text
http://localhost:5678/webhook/welcome
```

---

# Create the Workflow

The basic workflow is:

```text
Webhook
   ↓
Respond to Webhook
```

## Webhook Node

The Webhook node receives the request from the Express server.

Example request:

```json
{
  "name": "Hello",
  "email": null,
  "timestamp": "2026-09-30T10:38:18.463Z"
}
```

---

## Respond to Webhook Node

Configure:

```text
Respond With: JSON
```

Example response:

```json
{
  "success": true,
  "message": "Hello from n8n!",
  "receivedName": "{{ $json.body.name }}"
}
```

This response is sent back to the Express server.

---

# Running the Express Server

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The server should start on:

```text
http://localhost:3000
```

---

# Testing the API

The Express endpoint is:

```text
POST /api/v1/welcome/send-welcome
```

Complete URL:

```text
http://localhost:3000/api/v1/welcome/send-welcome
```

Send the following JSON:

```json
{
  "name": "Hello"
}
```

You can use Postman, Thunder Client, Insomnia, or curl.

Example using curl:

```bash
curl -X POST http://localhost:3000/api/v1/welcome/send-welcome \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Hello\"}"
```

---

# Expected Flow

When the API is called:

```text
POST /api/v1/welcome/send-welcome
```

Express receives:

```json
{
  "name": "Hello"
}
```

Express then sends the data to n8n:

```text
Express
   ↓
POST http://localhost:5678/webhook/welcome
```

n8n receives:

```json
{
  "name": "Hello",
  "email": null,
  "timestamp": "..."
}
```

The n8n workflow processes the request and returns:

```json
{
  "success": true,
  "message": "Hello from n8n!",
  "receivedName": "Hello"
}
```

Express then returns the n8n response to the client.

Example final response:

```json
{
  "success": true,
  "message": "Workflow executed successfully",
  "data": {
    "success": true,
    "message": "Hello from n8n!",
    "receivedName": "Hello"
  }
}
```

---

# Test URL vs Production URL

n8n provides two Webhook URLs.

### Test URL

```text
/webhook-test/welcome
```

Use this while developing and testing the workflow.

The workflow must be listening for a test event.

Example:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/welcome
```

### Production URL

```text
/webhook/welcome
```

Use this when the workflow is active/published.

Example:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/welcome
```

### Simple rule

```text
Development
    ↓
/webhook-test/welcome

Production
    ↓
/webhook/welcome
```

---

# Why Use n8n?

n8n is useful when you want to automate workflows involving multiple services.

For example:

```text
Express
   ↓
n8n
   ↓
Email
   ↓
Slack
   ↓
Database
   ↓
Notification
```

Instead of writing all of these integrations manually inside the Express application, n8n can handle the workflow.

---

# When to Use n8n

n8n is useful for:

* Workflow automation
* Connecting different APIs
* Sending notifications
* Email automation
* Scheduled tasks
* Webhooks
* Data processing
* Connecting third-party services
* Background workflows
* Moving data between services

For example:

```text
New User
   ↓
Express
   ↓
n8n
   ├── Send Email
   ├── Add to CRM
   └── Send Slack Notification
```

---

# When Not to Use n8n

n8n should not replace your main backend.

Keep important application logic inside your backend, such as:

* Authentication
* Authorization
* Payments
* User management
* Core business logic
* Database operations
* Real-time APIs
* Critical application logic

A good architecture is:

```text
                 ┌───────────────┐
                 │   Frontend    │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Node.js API   │
                 │   Express     │
                 └───────┬───────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
        Database                  n8n
                                 │
                     ┌───────────┼───────────┐
                     ▼           ▼           ▼
                   Email       Slack       Other APIs
```

---

# What I Learned From This Project

This project demonstrates the basic communication between:

```text
Node.js / Express
        ↕
      n8n
```

The important concept is:

> **Express handles the application/backend logic, while n8n can handle automation and multi-step workflows.**

This basic implementation can later be extended to real-world workflows such as:

```text
Express
   ↓
n8n
   ↓
AI API
   ↓
Database
   ↓
Email / Notification
```

or:

```text
Express
   ↓
n8n
   ↓
Payment
   ↓
Order Processing
   ↓
Notification
```

---

# Future Improvements

Some things I can add to this project later:

* Add authentication to the n8n Webhook
* Add database integration
* Add Redis/queues
* Add error handling and retries
* Add multiple n8n workflows
* Add scheduled workflows
* Connect external APIs
* Add AI API integration
* Dockerize the Express application
* Use Docker Compose for Express + n8n
* Add production deployment
* Add webhook security
