# Incidir Para Existir - Backend

## Overview
This repository contains the backend code for the "Incidir Para Existir" project. The backend is responsible for handling API requests, managing the database, and providing data to the frontend.

## Technologies Used
- Node.js
- Express.js
- MySQL 8
- Sequelize ORM

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL 8

### Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/incidir-para-existir.git
  ```
2. Navigate to the backend directory:
  ```bash
  cd incidir-para-existir/backend
  ```
3. Install dependencies:
  ```bash
  npm install
  ```
### Preparing the database

```sql
CREATE DATABASE production_movilizatorio
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
```

```sql
CREATE USER 'production_movilizatorio'@'%' IDENTIFIED BY 'YourStrongPassword';
```

```sql
GRANT ALL PRIVILEGES ON production_movilizatorio.* TO 'production_movilizatorio'@'%';
```

```sql
FLUSH PRIVILEGES;
```

### Configuration

Copy the `.env.example` file to `.env` and update the values as needed.

### Running the Application
1. Start the development server:
  ```bash
  npm run dev
  ```
2. The server will be running at `http://localhost:3000`. (In case you have changed the port number, the server will be running at `http://localhost:your_port_number`)

#### If you need a docker mysql database

You can execute this to get a quick mysql database running:

```bash
docker run -d --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -v ~/databases/mysql8:/var/lib/mysql mysql:8
```

Make sure to change the password and the volume path to your needs.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.