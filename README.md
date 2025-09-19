# Quiz App Backend

A RESTful API built with TypeScript, Express.js, PostgreSQL, and JWT authentication for managing quiz questions and quiz-taking functionality.

##  Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## Getting Started

### 1. Clone & Navigate

```bash
# Navigate to the backend directory
cd quiz-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE quiz_app;
```

#### Run Database Schema

```bash
# Navigate to database folder and run the schema
psql -U your_username -d quiz_app -f database/schema.sql
```

#### (Optional) Seed Sample Data

```bash
# If you have sample data, run:
npm run db:seed
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
rename the .env.example to .env and update the values

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Security Note**: Replace `JWT_SECRET` with a strong, random secret key in production.

### 5. Build & Run

#### Development Mode

```bash
npm run dev
```



