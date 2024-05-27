# Book Store API

## Pre-Reuisite
1. Install MySql in local computer


## Setup Instructions

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up the database and environment variables in `.env` file.
   `
    DATABASE_URL="mysql://username:password@localhost:3306/bookstore"
    
    JWT_SECRET="any_strong_long_string"
  `
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start the server: `npx ts-node src/index.ts`
6. Server Runs On `http://localhost:3000` by default

## API Endpoints

### Authentication

1. `POST /auth/signup` - Register a new user or seller.
    - Request Body :
                
                {
                    "name":"Your Name",
                    "email":"your_email@gmail.com",
                    "password": "password",
                    "role":"SELLER" / "USER"
                }

2. `POST /auth/login` - Login and get a JWT token.
    - Request Body :
  
                {
                    "email":"your_email@gmail.com",
                    "password": "password"
                }

        set the token in http request header while to crud or fetch on book database

        authorization : "Long JWTtoken got while logged in account"

### Books

- `GET /books` - Get all books (accessible to all users).
- `GET /books/:id` - Get a specific book by ID (accessible to all users).
- `POST /books/upload` - Upload books via CSV (accessible to sellers).
- `PUT /books/:id` - Update a book (accessible to the seller who owns the book).
- `DELETE /books/:id` - Delete a book (accessible to the seller who owns the book).
