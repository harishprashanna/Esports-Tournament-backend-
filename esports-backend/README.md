# Esports Backend

A small Spring Boot backend for internship demos.

## Tech Stack

- Spring Boot
- JWT
- PostgreSQL
- Redis
- Spring Data JPA
- Swagger
- Docker

## Features

- User register and login
- JWT token generation
- Team creation
- Tournament creation
- Tournament registration
- Match result submission
- Redis leaderboard caching

## Project Structure

src/main/java/com/example/esports
- config
- controller
- dto
- entity
- repository
- service

## API Endpoints

- POST /auth/register
- POST /auth/login
- POST /teams
- POST /tournaments
- GET /tournaments
- POST /registrations
- POST /matches
- GET /leaderboard

## Run Locally

1. Create a PostgreSQL database named `esports_db`
2. Run Redis on port `6379`
3. Update `application.yml` if needed
4. Run:

```bash
mvn spring-boot:run
```


