# Deployment Guide - Render

This guide shows how to deploy the ITELEC3 Marketplace API to Render for free.

## Prerequisites

- GitHub account with code pushed
- MongoDB Atlas account (free tier)
- Mailtrap account for email testing

## Step 1: Prepare MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (M0 free tier)
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Create a database named `marketplace`
5. Create a collection named `users` and `products`

## Step 2: Push Code to GitHub

From the marketplace folder:

```bash
# Initialize git and add files
git add .
git commit -m "Initial commit: ITELEC3 Marketplace API"
git branch -M main
git remote add origin https://github.com/JAM52105/ITELEC3-Finals.git
git push -u origin main
```

## Step 3: Deploy on Render

### 3.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +"
4. Select "Web Service"

### 3.2 Connect GitHub Repository
1. Click "Connect a repository"
2. Search for `ITELEC3-Finals`
3. Click "Connect"

### 3.3 Configure Service
Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `itelec3-marketplace` (or your choice) |
| **Environment** | `Node` |
| **Region** | `Oregon` (or nearest) |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Branch** | `main` |

### 3.4 Add Environment Variables

Click "Advanced" → "Add Environment Variable" for each:

```
NODE_ENV=production
PORT=3000
DATABASE=mongodb+srv://user:password@cluster.mongodb.net/marketplace
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-pass
```

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://itelec3-marketplace.onrender.com`

## Step 4: Verify Deployment

### Test Health Check
```bash
curl https://itelec3-marketplace.onrender.com
```
Should return the homepage HTML.

### Test API Endpoint
```bash
curl https://itelec3-marketplace.onrender.com/api/v1/products/top-3-cheap
```
Should return JSON array of products.

## Step 5: Test in Postman

Use the live URL in Postman. See [POSTMAN.md](./POSTMAN.md) for complete testing guide.

**Example Live Request:**
```
POST https://itelec3-marketplace.onrender.com/api/v1/users/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "12345678",
  "passwordConfirm": "12345678"
}
```

## Troubleshooting

### Build Fails
Check Render logs (Logs tab) for npm errors. Common issues:
- Missing `package.json` script `"start": "node server.js"`
- Typos in environment variables
- Missing dependencies in `package.json`

### Database Connection Error
- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
- Database name must exist in MongoDB Atlas

### Email Not Sending
- Verify Mailtrap credentials
- Check Mailtrap inbox for sent emails
- In Mailtrap, emails appear in "Inbox" tab

### Port Issues
- Render assigns PORT automatically - don't hard-code to 3000
- Use `const port = process.env.PORT || 3000` (already in your code ✅)

### Cold Start Issues
- First request after 15 min idle takes 5-10 seconds
- This is normal on free tier

## Free Tier Limits

- 750 free instance hours/month (~45 minutes/day if always running)
- Auto-deploys on git push
- SSL certificate included
- 256MB RAM

**Recommendation**: Keep your free instance, or upgrade to $7/month for unlimited hours.

## Update Deployment

To redeploy after code changes:

```bash
git add .
git commit -m "Update: fix bug"
git push origin main
```

Render automatically redeploys within 30 seconds.

## Next Steps

1. Take Postman screenshots (see [POSTMAN.md](./POSTMAN.md))
2. Export screenshots to zip file
3. Submit to Google Drive
4. Share live URL in submission

---

**Live URL**: https://itelec3-marketplace.onrender.com *(after deployment)*
