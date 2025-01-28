# Incidir Para Existir - Backend

## Overview
This repository contains the backend code for the "Incidir Para Existir" project. The backend is responsible for handling API requests, managing the database, and providing data to the frontend.

## Technologies Used
- Node.js
- Express.js
- MySQL 8
- Sequelize ORM
- S3 (Digital Ocean Spaces)
- NodeMailer

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

Two external services for mail and storage are required. The following variables are required:

```yaml
# .env

DO_SPACES_ENDPOINT
DO_SPACES_KEY
DO_SPACES_SECRET
DO_SPACES_BUCKET
```


### Running the Application
1. Start the development server:
  ```bash
  npm run dev
  ```
2. The server will be running at `http://localhost:3000`. (In case you have changed the port number, the server will be running at `http://localhost:your_port_number`)

3. Create the first admin. To do this, you're required to setup in the enviroment variables the value of the variable `MAGIC_THINGY`.

```yaml
# .env

# ...
MAGIC_THINGY=123456
# ...
```
Then you can use the following endpoint to create the first admin:

```bash
http://localhost:3000/users/setup?magic=123456
```

Complete the form with the required information and submit the form. **There we go! You have created the first admin.**

After making your first admin, the endpoint won't be available anymore, unless all the users are deleted from the database. 

Also, do not forget the query parameter `magic` in the URL, it is required to create the first admin. 

> PRO TIP: you can check the POST method of `/users/setup` and send a POST request if you have a tool like Postman or any other API testing tool. The body has `magic`
`firstName`, `lastName`, `email`, `password`).

```bash
curl -X POST http://localhost:3000/users/setup -d "
{
  \"firstName\": \"Admin\",
  \"lastName\": \"Admin\",
  \"email\": \"test@test.com\",
  \"password\": \"mySecurePassword\",
  \"magic\": \"123456\"
}"
```
  





#### If you need a docker mysql database

You can execute this to get a quick mysql database running:

```bash
docker run -d --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -v ~/databases/mysql8:/var/lib/mysql mysql:8
```

Make sure to change the password and the volume path to your needs.

## Contributing
Contributions are welcome! 

Please fork the repository and create a pull request with your changes.