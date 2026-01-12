#!/bin/bash

echo "🚍 BusTracker - Quick Start Script"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if in backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the backend directory${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cat > .env << 'EOF'
# Google Maps API Key
# PASTE YOUR API KEY HERE (replace the placeholder below)
GOOGLE_MAPS_API_KEY=your_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS - Allow requests from your React Native app
CORS_ORIGIN=*
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and add your Google Maps API key!${NC}"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Get computer's IP address
echo "🌐 Your computer's IP addresses:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Could not detect IP"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    hostname -I | awk '{print $1}'
else
    # Windows (Git Bash)
    ipconfig | grep "IPv4" | awk '{print $NF}'
fi
echo ""
echo -e "${YELLOW}📱 Update mobile/src/services/api.ts with this IP!${NC}"
echo ""

# Start the server
echo "🚀 Starting BusTracker API Server..."
echo ""
npm run dev

