# 🚀 American Nursing College - Deployment Guide

This guide will help you securely deploy the American Nursing College admissions website.

## 📋 Prerequisites

- ✅ Node.js (v16 or higher)
- ✅ Google Apps Script deployed and URL obtained
- ✅ Domain/hosting platform account (Vercel, Netlify, etc.)

## 🔐 Environment Setup

### Step 1: Create Environment File

1. **Copy the environment template:**
   ```bash
   cp environment-example.txt .env
   ```

2. **Edit `.env` file with your actual values:**
   ```bash
   # REQUIRED - Your Google Apps Script Web App URL
   REACT_APP_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   
   # Optional customizations
   REACT_APP_COLLEGE_NAME=American Nursing College
   REACT_APP_APPLICATION_PREFIX=ACN
   REACT_APP_COLLEGE_EMAIL=contact@americannursingcollege.edu
   REACT_APP_COLLEGE_PHONE=+1-555-0123
   
   NODE_ENV=production
   ```

### Step 2: Verify Environment Variables

**Test locally:**
```bash
npm start
```

**Check in browser console that form works and shows:**
- ✅ Admission ID generation (e.g., `ACN1234567890`)
- ✅ Form submission to Google Sheets
- ✅ No console errors about missing environment variables

## 🏗️ Build for Production

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

## ☁️ Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel:**
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add each variable from your `.env` file

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag `build` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository

3. **Set Environment Variables:**
   - Site Settings → Environment Variables
   - Add each variable from your `.env` file

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/american-nursing-college",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Environment Variables for GitHub Pages:**
   - GitHub repo → Settings → Secrets and variables → Actions
   - Add repository secrets for each environment variable

## 🔒 Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ Never commit actual Google Sheets URL to version control
- ✅ Environment variables set in deployment platform
- ✅ Google Apps Script permissions properly configured
- ✅ Test form submission in production

## 🛠️ Post-Deployment Tasks

### 1. Update Google Apps Script CORS (if needed)
If you encounter CORS errors, ensure your Google Apps Script allows your domain.

### 2. Test Complete Flow
1. ✅ Visit your deployed website
2. ✅ Submit a test application
3. ✅ Verify data appears in Google Sheets
4. ✅ Check admission ID is generated properly

### 3. Configure Domain (Optional)
- Set up custom domain in your hosting platform
- Update any hardcoded URLs if necessary

## 🐛 Troubleshooting

### Environment Variables Not Loading
```bash
# Verify variables are set correctly
echo $REACT_APP_GOOGLE_SHEETS_URL

# Make sure variables start with REACT_APP_
# and are set in your deployment platform
```

### Google Sheets Not Receiving Data
1. Check Google Apps Script logs
2. Verify Web App URL is correct
3. Ensure Apps Script permissions are set to "Anyone"

### Form Shows Error
1. Open browser console for detailed error messages
2. Check if Google Sheets URL environment variable is missing
3. Verify Google Apps Script is deployed properly

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test Google Apps Script independently
4. Ensure `.env` file is not committed to version control

## 🔄 Updates

When updating the project:
1. Pull latest changes
2. Check if new environment variables are needed
3. Update your `.env` file accordingly
4. Redeploy to your hosting platform

---

**⚠️ Security Reminder:** Never commit your `.env` file or expose your Google Apps Script URL publicly! 