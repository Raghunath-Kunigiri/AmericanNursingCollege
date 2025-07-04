const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting American Nursing College Development Environment...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating from template...');
  
  const templatePath = path.join(__dirname, 'environment-template.txt');
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf8');
    const envContent = template
      .replace(/^#.*$/gm, '') // Remove comments
      .replace(/^\s*$/gm, '') // Remove empty lines
      .replace(/YOUR_USERNAME/g, 'kunigiriraghunath9493')
      .replace(/YOUR_PASSWORD/g, 'oIgHpKQtG6GcA4fQ')
      .replace(/YOUR_CLUSTER/g, 'acn.oa10h')
      .replace(/YOUR_DATABASE/g, 'AmericanCollege')
      .replace(/YOUR_APP_NAME/g, 'ACN');
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully\n');
  } else {
    console.log('❌ Environment template not found. Please create .env manually\n');
  }
}

// Start the backend server
console.log('📡 Starting backend server...');
const serverProcess = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start the frontend server
console.log('🌐 Starting frontend server...');
const frontendProcess = spawn('npm', ['start'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  serverProcess.kill('SIGINT');
  frontendProcess.kill('SIGINT');
  process.exit(0);
});

serverProcess.on('error', (error) => {
  console.error('❌ Backend server error:', error.message);
});

frontendProcess.on('error', (error) => {
  console.error('❌ Frontend server error:', error.message);
});

console.log('\n🎉 Development environment starting...');
console.log('📍 Frontend: http://localhost:3000');
console.log('📍 Backend: http://localhost:5000');
console.log('📍 API Health: http://localhost:5000/api/health');
console.log('\n💡 Press Ctrl+C to stop all servers\n'); 