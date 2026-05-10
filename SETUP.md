# Local Development Setup

## Prerequisites

- Java 21+
- Maven 3.9+ (or use included `./mvnw`)
- Node.js 20 LTS+
- Docker + Docker Compose
- PostgreSQL 15 (only for local setup without Docker)

## Environment Variables

```bash
cp .env.example .env
```

Fill in the values. The `.env` file is gitignored and must never be committed.

## Running with Docker (Recommended)

```bash
docker-compose up -d --build
```

Stop services:
```bash
docker-compose down
```

Stop and remove volumes:
```bash
docker-compose down -v
```

View logs:
```bash
docker-compose logs -f
```

## Running Locally Without Docker

### Database

```sql
CREATE DATABASE dchub;
CREATE USER dchub_user WITH PASSWORD 'dchub_pass';
GRANT ALL PRIVILEGES ON DATABASE dchub TO dchub_user;
```

```bash
psql -U dchub_user -d dchub -f database/init.sql
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

API available at http://localhost:8080.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at http://localhost:5173.

## Opening the Project in IntelliJ IDEA

1. File > Open
2. Select the root `DCHub/` folder
3. IntelliJ detects both `pom.xml` (backend) and `package.json` (frontend) automatically
4. Maven and npm scripts are available in the same IDE window

## Git Workflow

```bash
git checkout dev
git add .
git commit -m "feat: describe your change"
git push origin dev
```

Open a pull request from `dev` into `main` when a feature is complete.

## Commit Message Convention

- `feat:` new feature
- `fix:` bug fix
- `chore:` setup, config, maintenance
- `docs:` documentation only
- `refactor:` restructuring without feature change
- `style:` formatting only