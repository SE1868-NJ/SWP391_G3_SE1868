# Description

- This is a backend project built with Node.js and MySQL.

## Prerequisites

- Node.js v22.x or higher
- MySQL
- NPM or Yarn package manager

## Installation

1. Clone the repository

- git clone https://github.com/SE1868-NJ/SWP391_G3_SE1868.git

2. Install dependencies

- npm install or yarn install

3. Set up environment variables

- Copy env.example to create a new .env file
- Configure your environment variables in .env

4. Start the project

# Development mode

- npm run dev

# Production mode

- npm run start

# Start project with Docker

1. Build and start the services

- docker compose up --build

2. Stop Docker Compose

- docker compose down

# Database Management

## Migrations

1. Create a new migration:

```sh
npx sequelize-cli migration:generate --name create-users
```

2. Run migrations:

- Migrate All

```sh
npx sequelize-cli db:migrate
```

- Migarate Single

```sh
npx sequelize-cli db:migrate --name <migrate_file_name>.js
```

1. Undo last migration:

```sh
npx sequelize-cli db:migrate:undo
```

## Seeding

1. Seed the database:

- npx sequelize-cli db:seed
