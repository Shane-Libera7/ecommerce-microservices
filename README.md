# Ecommerce Microservices API

A multi-service e-commerce backend built with a microservices architecture. Each service is independently deployable, owns its own database, and communicates with other services either synchronously via HTTP or asynchronously via RabbitMQ.

---

## Services

### API Gateway (Node.js — port 3000)
The single entry point for all external traffic. Routes incoming requests to the appropriate service and is the only service exposed to the outside world. All other services are only accessible within the Docker network.

### User Service (Node.js — port 3001)
Handles user registration, login, and JWT authentication. Issues tokens that are validated by all other services using a shared secret. Exposes an internal endpoint for other services to look up user information by ID.

### Product Service (Node.js — port 3002)
Manages the product catalogue including inventory tracking. Exposes a public API for browsing products and an internal endpoint for inventory checks. Consumes `order.placed` events from RabbitMQ to decrement inventory when an order is confirmed.

### Order Service (Java Spring Boot — port 3003)
Handles order placement. When an order is placed it makes a synchronous HTTP call to the Product Service to verify inventory, creates the order with a PENDING status, then publishes an `order.placed` event to RabbitMQ to trigger downstream processing.

### Notification Service (Node.js — port 3004)
Consumes `order.placed` events from RabbitMQ and sends order confirmation notifications to users.

---

## Communication

**Synchronous (HTTP):**
- Client → API Gateway → Services
- Order Service → Product Service (inventory check)
- Any service → User Service (internal user lookup)

**Asynchronous (RabbitMQ):**
- Order Service publishes `order.placed`
- Product Service consumes `order.placed` → decrements inventory
- Notification Service consumes `order.placed` → sends confirmation

---

## Tech Stack

| Service | Language | Framework | Database |
|---|---|---|---|
| API Gateway | Node.js | Express | — |
| User Service | Node.js | Express | PostgreSQL |
| Product Service | Node.js | Express | PostgreSQL |
| Order Service | Java | Spring Boot | PostgreSQL |
| Notification Service | Node.js | Express | — |
| Message Broker | — | RabbitMQ | — |

---

## Running Locally

```bash
docker compose up --build
```

This starts all services, their databases, and RabbitMQ in one command.






## Architecture 


                        ┌─────────────────┐     
                        │   CLIENT/USER   │
                        └────────┬────────┘
                                 │ HTTP
                                 ▼
                        ┌─────────────────┐
                        │   API GATEWAY   │
                        │   (port 3000)   │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
     │  USER SERVICE  │ │PRODUCT SERVICE │ │ ORDER SERVICE  │
     │   (Node.js)    │ │   (Node.js)    │ │  (Java Spring) │
     │   port 3001    │ │   port 3002    │ │   port 3003    │
     └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
             │                  │                  │
             ▼                  ▼                  │
        ┌─────────┐        ┌─────────┐             │ publishes
        │users_db │        │products │             │ order.placed
        │(Postgres)│       │_db      │             ▼
        └─────────┘        │(Postgres)│    ┌───────────────┐
                           └─────────┘    │   RABBITMQ    │
                                          └───────┬───────┘
                                                  │
                                    ┌─────────────┴──────────────┐
                                    │                            │
                                    ▼                            ▼
                           ┌────────────────┐         ┌──────────────────┐
                           │PRODUCT SERVICE │         │NOTIFICATION SVC  │
                           │  (consumes)    │         │   (Node.js)      │
                           │inventory update│         │  port 3004       │
                           └───────┬────────┘         └────────┬─────────┘
                                   │                           │
                                   ▼                           ▼
                              ┌─────────┐               ┌──────────┐
                              │products │               │  Email/  │
                              │_db      │               │  Console │
                              └─────────┘               └──────────┘