# Budget Bites

Budget Bites is a full-stack food ordering web application that helps users find food based on their preferences and budget, place orders, and track their order status.

## Features

- Search food items by name
- Filter food items based on budget
- Browse food by category
- Add food items to the cart and manage quantities
- Place food orders
- User authentication and role-based access
- Food management for creators
- Smart food combination suggestions within a budget
- Track order status from placement to delivery

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Development Tools
- Postman for API testing
- Git and GitHub for version control

## Project Structure

The project contains separate frontend and backend applications.

- **Frontend:** User interface built with React and Vite.
- **Backend:** REST APIs built with Node.js and Express.js.
- **Database:** MongoDB for storing application data.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB database access
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Replace `YOUR_REPOSITORY_URL` with your GitHub repository URL.

### 2. Set Up the Frontend

Open a terminal in the frontend directory and run:

```bash
npm install
```

Create a `.env` file using the frontend `.env.example` file and configure the required environment variables.

Start the frontend:

```bash
npm run dev
```

### 3. Set Up the Backend

Open another terminal in the backend directory and run:

```bash
npm install
```

Create a `.env` file using the backend `.env.example` file. Configure the MongoDB connection and other required environment variables.

Start the backend using the appropriate script defined in its `package.json`.

## Environment Variables

Actual `.env` files are not included in this repository for security reasons.

Use the provided `.env.example` files as templates and configure your own environment variables before running the application.

Never upload passwords, database credentials, or private API secrets to GitHub.

## Project Purpose

Budget Bites was developed as a full-stack web development project to practise frontend development, backend API creation, database integration, authentication, cart management, and order tracking.

## Author

Developed as a full-stack web development learning project.
