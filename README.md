# DCHub

DCHub is a data collection and storage web application.

Users can register, log in, and upload data in the form of plain text or files
(PDF, Word, Excel, CSV). Each uploaded entry is associated with the user who
submitted it. Categories are supported as an optional feature.

## Tech Stack

- **Backend**: Spring Boot 4 + Java 21 + Maven
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL 15
- **Authentication**: JWT (Stateless)
- **Infrastructure**: Docker + Docker Compose

## Project Structure
```
DCHub/
├── backend/                 # Spring Boot application (Maven project root)
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/mk/ukim/finki/dchub/
│ │ │ │ ├── bootstrap/       # Data initializer
│ │ │ │ ├── config/          # Security and JWT configuration
│ │ │ │ ├── model/           # JPA entity classes
│ │ │ │ ├── repository/      # Spring Data JPA interfaces
│ │ │ │ ├── service/         # Business logic
│ │ │ │ └── web/             # REST controllers
│ │ │ └── resources/
│ │ │ └── application.properties
│ └── Dockerfile
├── frontend/                # React + TypeScript application
│ └── Dockerfile
├── database/
│ └── init.sql               # PostgreSQL initialization script
├── storage/                 # Persistent volume for uploaded files
├── docker-compose.yml
├── .env.example
└── SETUP.md
```

## Quick Start

```bash
cp .env.example .env
docker-compose up -d --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

See [SETUP.md](./SETUP.md) for full details.

## Branching Strategy

- `main` — stable, production-ready code only
- `dev` — active development branch

All work is done on `dev` and merged into `main` via pull requests.