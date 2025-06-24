# Deployment Guide - American College of Nursing

## Production API Issues - Solutions

### Current Issues
- All API endpoints returning 404 errors
- JavaScript receiving HTML instead of JSON (causing "Unexpected token 'T'" errors)
- Forms not submitting properly

### Root Cause
The Flask API server is not running in production or is not accessible from the frontend.

## Solutions

### Option 1: Run Flask API on Same Server (Recommended)

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Flask API Server**
   ```bash
   python start_server.py
   ```
   
   Or for production:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Verify API is Running**
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Should return JSON response like:
   ```json
   {
     "success": true,
     "message": "American College of Nursing API is running",
     "timestamp": "2025-06-23T19:21:02.483121"
   }
   ```

### Option 2: Use Different API Server

If you need to run the API on a different server:

1. **Update API Configuration**
   Edit `static/js/api.js` and change:
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'https://your-api-server.com', // Your API server URL
       TIMEOUT: 30000
   };
   ```

2. **Enable CORS**
   Make sure your API server allows requests from your frontend domain.

### Option 3: Use Serverless/Cloud Functions

For cloud deployment, you can:
1. Deploy the Flask app to services like Vercel, Heroku, or Railway
2. Update the API_CONFIG.BASE_URL to point to your deployed API

## Testing Your Deployment

1. **Check API Endpoints**
   ```bash
   curl https://your-domain.com/api/health
   curl https://your-domain.com/api/students/programs
   curl https://your-domain.com/api/contact/inquiry-types
   ```

2. **Check Frontend**
   - Open browser developer tools (F12)
   - Go to Network tab
   - Try submitting a form
   - Check if API calls are successful (status 200) and returning JSON

## Environment Variables

Create a `.env` file in your project root:

```env
# MongoDB connection (optional)
MONGODB_URI=mongodb://localhost:27017/AmericanCollege

# Flask configuration
SECRET_KEY=your-secret-key-here
NODE_ENV=production

# CORS settings
ALLOWED_ORIGINS=https://your-domain.com
PRODUCTION_DOMAIN=https://your-domain.com

# Server port
PORT=5000
```

## Files Fixed

1. **app.py** - Fixed API endpoints and error handling
2. **static/js/api.js** - Fixed JavaScript errors and added better error handling
3. **requirements.txt** - Added missing email-validator dependency
4. **routes/contact.py** - Fixed inquiry types format
5. **start_server.py** - Created simple server start script

## Quick Debug Commands

If you're still having issues:

```bash
# Check if Flask is running
netstat -tlnp | grep :5000

# Check Flask logs
python app.py

# Test API directly
curl -X GET http://localhost:5000/api/students/programs
curl -X GET http://localhost:5000/api/contact/inquiry-types
curl -X GET http://localhost:5000/api/health
```

## Contact Support

If you need help with deployment, the main things to check are:
1. Is the Flask server running?
2. Are the API URLs correct?
3. Are there any CORS issues?
4. Check browser console for specific error messages

The code has been fixed and should work correctly once the server is properly deployed. 