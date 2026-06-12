# Civic Connect

Civic Connect is a MERN stack civic issue reporting and resolution platform for citizens and municipal administrators.

## Features

- Citizen signup, login, protected routes, and contribution points
- Admin role with issue management, priority updates, progress tracking, analytics, and map monitoring
- JWT access and refresh token support
- Citizen/Admin signup with city and area details
- Admin notification inbox for new citizen reports
- Admin replies that notify citizens and appear in issue history
- Issue reporting with image URL, category, location, status, department routing, and priority auto-calculation
- Real-time notifications with Socket.IO
- OpenStreetMap and React Leaflet issue map centered for Bhopal by default
- Recharts analytics and contributor leaderboard
- Production-minded Express security middleware

## Quick Start

```bash
npm install
npm run install:all
cp server/.env.example server/.env
npm run seed
npm run dev
```

Client: http://localhost:5173  
Server: http://localhost:5000

## Demo Users

After `npm run seed`:

- Citizen: `citizen@civicconnect.gov` / `Password123!`
- Admin: `admin@civicconnect.gov` / `Password123!`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md).
