# PostaAi

A Brazilian social network inspired by Instagram, built with TypeScript, Node.js, Express, and Prisma.

## Features

- Media Sharing: Share photos and posts seamlessly.
- Real-Time Interactions: Instant updates and notifications via WebSockets.
- User Authentication: Secure JWT-based registration and login with password hashing.
- Type-Safe Database Access: Powered by Prisma ORM and PostgreSQL.

## Tech Stack

- Language: TypeScript
- Runtime & Framework: Node.js, Express
- Real-Time: Socket.IO
- Database ORM: Prisma
- Validation & Auth: Zod, JSON Web Tokens (JWT), Bcrypt

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL instance

### Installation

1. Clone the repository:
   git clone https://github.com/BrenninhoTools/PostaAi.git
   cd PostaAi

2. Install dependencies:
   npm install

3. Configure environment variables:
   Create a .env file in the root directory:
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/postaai?schema=public"
   JWT_SECRET="your-secret-key"
   CORS_ORIGIN="*"

4. Run database migrations:
   npm run prisma:migrate

5. Start the development server:
   npm run dev

## Project Structure

PostaAi/
├── src/
│   └── postai/
│       └── main.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── README.txt

## License

This project is licensed under the MIT License - see the LICENSE file for details.
