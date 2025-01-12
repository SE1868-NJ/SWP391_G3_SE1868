# Description
- This is a backend project built with Node.js and MySQL.

## Prerequisites
* Node.js v22.x or higher
* MySQL
* NPM or Yarn package manager

## Installation
1. Clone the repository
- git clone https://github.com/dong-0404/be_nodejs.git
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
- docker-compose up --build
2. Stop Docker Compose
- docker-compose down


# Database Management

## Migrations
1. Create a new migration:
- npx sequelize-cli migration:generate --name create-users (Example)
2. Run migrations:
- npx sequelize-cli db:migrate
3. Undo last migration:
- npx sequelize-cli db:migrate:undo

## Seeding
1. Seed the database:
- npx sequelize-cli db:seed:all


