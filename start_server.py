#!/usr/bin/env python3
"""
Start script for American College of Nursing API
"""
import os
from app import app

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Get environment
    env = os.environ.get('NODE_ENV', 'development')
    debug = env != 'production'
    
    print(f"🚀 Starting American College of Nursing API")
    print(f"📍 Port: {port}")
    print(f"🔧 Environment: {env}")
    print(f"🐛 Debug: {'ON' if debug else 'OFF'}")
    
    # Run the app
    app.run(
        host='0.0.0.0',  # Listen on all interfaces
        port=port,
        debug=debug
    ) 