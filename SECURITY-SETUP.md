# 🔒 Security Setup Instructions

## ⚠️ IMPORTANT: Before Pushing to Git

Follow these steps to secure your sensitive information:

### 1. 📋 Create Environment File
```bash
# Copy the template and create your .env file
cp environment-template.txt .env
```

### 2. ✏️ Edit .env File
Open `.env` and replace the placeholder values:
```env
MONGODB_URI=mongodb+srv://YOUR_ACTUAL_USERNAME:YOUR_ACTUAL_PASSWORD@acn.oa10h.mongodb.net/AmericanCollege?retryWrites=true&w=majority&appName=ACN
```

### 3. ✅ Verify Security
Check that your `.env` file is NOT tracked by Git:
```bash
git status
# .env should NOT appear in the list
```

### 4. 🧹 Remove Sensitive Data from Git History
If you've already committed sensitive data, clean it:
```bash
# Remove .env from any previous commits
git rm --cached .env

# If you need to clean history (DANGEROUS - creates new commit hashes):
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
```

### 5. 🚀 Safe to Push
Now you can safely push to Git:
```bash
git add .
git commit -m "feat: implemented secure environment configuration"
git push
```

## 🛡️ Security Features Implemented

### ✅ Environment Variables
- MongoDB credentials moved to `.env` file
- Server enforces environment variables
- Graceful fallback for development

### ✅ Enhanced .gitignore
- All `.env*` files ignored (except template)
- Database backups ignored
- Private keys and certificates ignored
- Security-focused exclusions

### ✅ Improved CORS
- Environment-specific origins
- Production domain configuration
- Credentials support

### ✅ Error Handling
- Different error messages for dev/production
- Prevents information leakage
- Graceful degradation

## 📝 Production Deployment

### Environment Variables Needed:
```env
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
PORT=5000
```

### Additional Security for Production:
1. Set up proper domain in CORS configuration
2. Use HTTPS certificates
3. Implement rate limiting
4. Add authentication/authorization
5. Set up monitoring and logging

## 🔐 Never Commit These Files:
- `.env` (contains secrets)
- Database backups
- Private keys (.pem, .key files)
- Any file with passwords or tokens

## ⚡ Quick Security Check:
```bash
# Verify no sensitive data in Git
git log --oneline | head -10
git show --name-only

# Check current ignored files
git ls-files --others --ignored --exclude-standard
```

---
**Remember**: Security is ongoing! Regularly rotate passwords and review access. 