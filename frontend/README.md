# Rack Tracker v1

A full-stack infrastructure management app for tracking server racks and equipment.
Built as a pre-onboarding capstone for the InfraSight codebase at Spectrum Software & Consulting.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-5-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)

---

## Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query v5 |
| Backend  | Express 5, TypeScript, Zod, Helmet, CORS                    |
| Database | PostgreSQL 16 (raw `pg`, no ORM)                            |
| Infra    | Docker Compose, multi-stage health checks                   |

---

## Architecture

```
HTTP Request
↓
routes.ts        → URL mapping
↓
controller.ts    → req/res handling, Zod validation
↓
service.ts       → business logic, uniqueness checks
↓
repository.ts    → ALL SQL (parameterized, no exceptions)
↓
PostgreSQL
```

Every module lives in `backend/src/modules/<name>/` with 5 files:
`interface` · `schema` · `repository` · `service` · `controller` · `routes`

---

## Getting Started

### Prerequisites

- Docker Desktop running
- Port `5173`, `3000`, `5432` free

### Run the app

```bash
# 1. Clone
git clone https://github.com/MofakkarHM/rack-tracker-v1.git
cd rack-tracker-v1

# 2. Copy env
cp .env.example .env

# 3. Start everything
docker compose up --build
```

That's it. The database seeds automatically on first boot.

| Service  | URL                           |
| -------- | ----------------------------- |
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:3000         |
| Health   | http://localhost:3000/healthz |

### Stop

```bash
docker compose down
```

### Reset database

```bash
docker compose down -v   # drops the postgres volume
docker compose up --build
```

---

## Environment Variables

See `.env.example` for all variables. Never commit `.env`.

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| POSTGRES_USER     | Postgres username                  |
| POSTGRES_PASSWORD | Postgres password                  |
| POSTGRES_DB       | Database name                      |
| DATABASE_URL      | Full connection string for backend |
| BACKEND_PORT      | Port the Express server listens on |
| CORS_ORIGIN       | Allowed frontend origin for CORS   |
| VITE_API_URL      | Backend URL used by frontend       |

---

## API Reference

All responses follow the shape:

```json
{ "success": true, "data": { } }
{ "success": false, "message": "...", "errors": [] }
```

### Racks

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| GET    | /api/racks     | List all racks |
| GET    | /api/racks/:id | Get rack by id |
| POST   | /api/racks     | Create a rack  |
| PUT    | /api/racks/:id | Update a rack  |
| DELETE | /api/racks/:id | Delete a rack  |

**POST /api/racks body:**

```json
{
  "name": "Rack-A1",
  "location": "Data Center 1 - Row A",
  "total_slots": 42
}
```

### Equipment

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | /api/equipment     | List all equipment  |
| GET    | /api/equipment/:id | Get equipment by id |
| POST   | /api/equipment     | Create equipment    |
| PUT    | /api/equipment/:id | Update equipment    |
| DELETE | /api/equipment/:id | Delete equipment    |

**POST /api/equipment body:**

```json
{
  "name": "Web Server 01",
  "type": "server",
  "make": "Dell",
  "tag": "TAG-013",
  "rack_id": 1,
  "slot_number": 5
}
```

**Equipment types:** `server` · `switch` · `firewall` · `storage` · `patch` · `other`

---

## Manual Test Plan

Run `docker compose up --build` before testing. All tests run against `http://localhost:5173`.

### Racks

| #   | Scenario                        | Steps                                 | Expected                                   |
| --- | ------------------------------- | ------------------------------------- | ------------------------------------------ |
| R1  | List racks                      | Open Racks tab                        | 4 seeded racks visible                     |
| R2  | Create rack                     | Click "+ Add Rack", fill form, submit | New rack appears in grid                   |
| R3  | Duplicate name rejected         | Create rack with existing name        | Error message shown, rack not created      |
| R4  | Validation — empty fields       | Submit empty form                     | Field-level errors shown                   |
| R5  | Validation — slots out of range | Enter 99 for total_slots              | Error: cannot exceed 42U                   |
| R6  | Edit rack                       | Click Edit, change location, save     | Updated values shown on card               |
| R7  | Delete rack                     | Click Delete, confirm                 | Rack removed, equipment becomes unassigned |
| R8  | Empty state                     | Delete all racks                      | Empty state message shown                  |
| R9  | Navigate to equipment           | Click rack card                       | Equipment tab opens filtered to that rack  |

### Equipment

| #   | Scenario               | Steps                                  | Expected                                                |
| --- | ---------------------- | -------------------------------------- | ------------------------------------------------------- |
| E1  | List equipment         | Open Equipment tab                     | All 12 seeded items visible across rack grids           |
| E2  | Rack grid slots        | View any rack grid                     | Occupied slots show equipment, empty slots show "Empty" |
| E3  | Create unassigned      | Add equipment with no rack selected    | Appears in Unassigned section                           |
| E4  | Create in rack         | Add equipment, select rack + slot      | Appears in correct slot in rack grid                    |
| E5  | Duplicate tag rejected | Create equipment with existing tag     | Error: tag already exists                               |
| E6  | Slot conflict rejected | Assign equipment to occupied slot      | Error: slot already occupied                            |
| E7  | Slot exceeds capacity  | Assign slot number > rack total_slots  | Error: exceeds rack capacity                            |
| E8  | Edit equipment         | Click occupied slot, change make, save | Updated in grid                                         |
| E9  | Move to different rack | Edit equipment, change rack + slot     | Moves to new rack grid                                  |
| E10 | Unassign equipment     | Edit equipment, clear rack, save       | Moves to Unassigned section                             |
| E11 | Delete equipment       | Click Delete in unassigned list        | Item removed                                            |
| E12 | Filter by rack tab     | Click a rack tab                       | Only that rack's grid shown                             |

### API (optional — test with browser or curl)

| #   | Scenario     | Command              | Expected                                |
| --- | ------------ | -------------------- | --------------------------------------- |
| A1  | Health check | GET /healthz         | `{"success":true}`                      |
| A2  | Invalid body | POST /api/racks `{}` | 400 with errors array                   |
| A3  | Not found    | GET /api/racks/9999  | 404 with message                        |
| A4  | Request logs | Check Docker logs    | `METHOD /path STATUS - Xms` per request |

---

## Project Structure

```
rack-tracker-v1/
├── backend/
│   └── src/
│       ├── db/
│       │   └── pool.ts
│       ├── middleware/
│       │   ├── requestLogger.ts
│       │   └── errorHandler.ts
│       └── modules/
│           ├── racks/
│           │   ├── racks.interface.ts
│           │   ├── racks.schema.ts
│           │   ├── racks.repository.ts
│           │   ├── racks.service.ts
│           │   ├── racks.controller.ts
│           │   └── racks.routes.ts
│           └── equipment/
│               ├── equipment.interface.ts
│               ├── equipment.schema.ts
│               ├── equipment.repository.ts
│               ├── equipment.service.ts
│               ├── equipment.controller.ts
│               └── equipment.routes.ts
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       │   ├── ui/
│       │   ├── racks/
│       │   └── equipment/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── types/
├── db/
│   └── init.sql
├── docker-compose.yaml
├── .env.example
└── README.md
```
