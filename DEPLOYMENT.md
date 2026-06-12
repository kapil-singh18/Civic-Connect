# Civic Connect Deployment Guide

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Add a database user.
3. Allow network access for your Render services.
4. Copy the connection string into `MONGO_URI`.

## Render Backend

Create a Web Service from this repository, or use the included [render.yaml](render.yaml) blueprint.

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-another-strong-secret
CLIENT_URL=https://your-vercel-domain.vercel.app
```

## Vercel Frontend

Import the repository into Vercel.

- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variables:

```bash
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_SOCKET_URL=https://your-render-api.onrender.com
```

The client includes `client/vercel.json` with SPA rewrites for React Router.

## Production Notes

- Create admin users directly in MongoDB or through a private operational script.
- Rotate JWT secrets before launch.
- Store uploaded images in a durable object store such as Cloudinary, S3, or Azure Blob Storage.
- Keep MongoDB Atlas IP access restricted to trusted service ranges where possible.
