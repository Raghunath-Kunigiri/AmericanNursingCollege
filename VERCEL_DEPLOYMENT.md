# 🚀 Vercel Deployment Guide for American College of Nursing

## ✅ Pre-Deployment Checklist

All files have been prepared for Vercel deployment:
- ✅ `vercel.json` configuration file created
- ✅ `api/app.py` serverless function created
- ✅ `api/requirements.txt` dependencies configured
- ✅ Required directories copied to `api/` folder
- ✅ API configuration updated for Vercel
- ✅ Vercel CLI installed

## 🚀 Deployment Commands

### Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

This will:
- Build your application
- Deploy the Flask API as serverless functions
- Deploy your static files (HTML, CSS, JS, images)
- Provide you with a production URL

### Alternative: Deploy in Development Mode First
```bash
# Deploy to development environment first
vercel

# Then promote to production
vercel --prod
```

## 🔧 Environment Variables Setup

After deployment, set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/AmericanCollege?retryWrites=true&w=majority
SECRET_KEY=your-super-secret-key-here
NODE_ENV=production
```

## 📝 Manual Deployment Alternative

If you prefer manual deployment:

### Option 1: Vercel CLI with Project Setup
```bash
# Initialize Vercel project
vercel init

# Configure project settings when prompted:
# - Project name: american-nursing-college
# - Framework preset: Other
# - Output directory: (leave blank)
# - Build command: (leave blank)

# Deploy
vercel --prod
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

```bash
# Replace YOUR_DOMAIN with your actual Vercel domain
curl https://YOUR_DOMAIN.vercel.app/api/health
curl https://YOUR_DOMAIN.vercel.app/api/students/programs
curl https://YOUR_DOMAIN.vercel.app/api/contact/inquiry-types
```

## 📋 Expected Vercel Project Structure

Your deployed project will have:
```
your-project.vercel.app/
├── /                          # Your main website (index.html)
├── /static/                   # CSS, JS, and other static files
├── /images/                   # Image assets
├── /api/health               # Health check endpoint
├── /api/students/programs    # Students API
├── /api/students/apply       # Application submission
├── /api/contact/inquiry-types # Contact API
└── /manifest.json            # PWA manifest
```

## 🔧 Troubleshooting

### Common Issues:

1. **API Routes Not Working**
   - Ensure `vercel.json` is in the root directory
   - Check that `api/app.py` exists and has correct imports

2. **CORS Errors**
   - Environment variables are already configured for CORS
   - No additional setup needed

3. **Database Connection Issues**
   - Ensure `MONGODB_URI` is set in Vercel environment variables
   - Check MongoDB Atlas network access settings

4. **Import Errors**
   - All required files are copied to `api/` directory
   - Python path is configured in `vercel.json`

### Logs and Debugging:
```bash
# View deployment logs
vercel logs

# View function logs (replace with your function URL)
vercel logs https://your-domain.vercel.app/api/health
```

## 🎉 Success!

After successful deployment:
1. Your website will be live at `https://your-project.vercel.app`
2. All API endpoints will work automatically
3. Forms will submit successfully
4. Data will be stored in MongoDB

## 🔄 Future Updates

To update your deployment:
```bash
# Make your changes, then redeploy
vercel --prod
```

Vercel will automatically update your live site with zero downtime!

---

## 📞 Support

If you encounter any issues:
1. Check the Vercel function logs
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Test API endpoints individually

Your American College of Nursing website is now ready for production! 🎓 