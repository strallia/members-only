# Members Only

![Home page](./public/images/unauthenticated.png)

## Purpose

To practice authentication with PassportJS using Local Strategy by creating a message board app where users can have a role of Basic, Premium, or Admin each with different visibilities and CRUD settings.

Built with: Express, Node, PostgreSQL, EJS, Figma, PassportJS

## Forms

Login | Signup | Upgrade Role
:-------------------------:|:-------------------------:|:-------------------------:
![Login form](./public/images/login.png)|![Signup form](./public/images/signup.png)|![Upgrade role form](./public/images/upgrade-role.png)

## User Role Views

Basic | Premium | Admin
:-------------------------:|:-------------------------:|:-------------------------:
![Basic user](./public/images/basic-user.png)|![Premium user](./public/images/premium-user.png)|![Admin user](./public/images/admin-user.png)

## Features

- Protects passwords using bcrypt for hashing and salting
- Prevents unauthenticated users from accessing protected routes
- Restrict access to certain CRUD functionalities based on the user's role
- Server-side validation and sanitization of form inputs
- Change user role with secret passwords

## Database Schema

![Database schema diagram](./public/images/db-schema.png)

## Figma Designs

![Figma designs](./public/images/figma-designs.png)

## Getting Started

Follow these steps to get the application running locally on your system.

1. Make sure you have the following installed on your system:

  - Node.js (version 20.15.1 or higher)
  - PostgreSQL client to interact with the database
  - Any code editor (e.g. VS Code)

2. In a terminal, clone the repository

```bash
  git clone https://github.com/strallia/members-only.git
```

3. Navigate to the project directory

```bash
cd members-only
```

4. Install Dependencies

```bash
npm install
```

5. Create a `.env` file in the root directory of the project and add the following environment variables, replacing the values inside `< >` with your own credentials:

```bash
DATABASE_URL="postgresql://<dbuser>:<secretpassword>@localhost:5432/members_only"
SESSION_SECRET="superSecretSessionPassword"

# Secret passwords for role upgrades
ADMIN_PASS="<any password>"
PREMIUM_PASS="<any password>"
```

6. Start the Development Server

```bash
npm start
```

This will launch the app at http://localhost:3000.

