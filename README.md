# Dockerized Todo API

A simple Node.js + Express REST API for managing a todo list, fully containerized with Docker and deployable to AWS EC2 using GitHub Actions.

---

## Project Reference

Based on: https://roadmap.sh/projects/multi-container-service

---

## Features

- Express API with CRUD routes for todos (`/todos`)
- MongoDB database integration
- Containerized with Docker and docker-compose
- Terraform for AWS provisioning
- Ansible for server configuration
- GitHub Actions (planned) for automated CI/CD

---

## Environment Variables

Local development uses `.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/simple_todo_api
```

Environment variables are set directly on the EC2 instance for production.

---

## Docker Usage

### Build Locally

```bash
docker build -t todo-api .
```

### Run Locally

```bash
docker run -p 3000:3000 --env-file .env todo-api
```

Visit: `http://localhost:3000/todos`

---

## GitHub Actions CI/CD

On push to the **main** branch:

1. Builds Docker image
2. Pushes image to Docker Hub (`markfinerty/dockerized-todo-api:latest`)
3. Connects to EC2 via SSH
4. Runs `docker compose pull && docker compose up -d`
5. Deploys latest image automatically

Workflow file: `.github/workflows/deploy.yml`

---

## EC2 Server Setup

The EC2 host should have this file at `~/app/docker-compose.yml`:

```
services:
  api:
    image: markfinerty/dockerized-todo-api:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
  mongodb:
    image: mongo:latest
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## API Endpoints

| Method | Route        | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/todos`     | Get all todos           |
| POST   | `/todos`     | Create a new todo       |
| PUT    | `/todos/:id` | Update an existing todo |
| DELETE | `/todos/:id` | Delete a todo           |

Example:

```bash
curl -X POST http://localhost:3000/todos   -H "Content-Type: application/json"   -d '{"task": "Finish Terraform setup"}'
```

---

## Requirements

- Docker and Docker Compose installed on EC2
- EC2 security group allows inbound traffic on port 3000
- GitHub secrets configured:
  - DOCKER_HUB_USERNAME
  - DOCKER_HUB_TOKEN
  - EC2_HOST
  - EC2_USER
  - EC2_SSH_KEY
  - EC2_PORT _(optional)_

---

## Infrastructure

| Tool           | Purpose                              |
| -------------- | ------------------------------------ |
| Terraform      | Provisions EC2 and networking        |
| Ansible        | Installs Docker and runs containers  |
| GitHub Actions | Automates build and deployment (WIP) |

---

## Commands

```bash
# Local testing
npm install
npm start

# Docker local build
docker compose up --build

# Terraform deploy
cd terraform
terraform init
terraform apply

# Ansible configure
cd ansible
ansible-playbook -i inventory playbook.yml
```
