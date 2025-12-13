#!/bin/bash

echo "🛑 Stopping all processes..."

# Kill all backend processes
echo "Killing backend processes on port 5001..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
sleep 1

# Kill all frontend processes
echo "Killing frontend processes on port 3000 and 3001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

echo "✅ All processes stopped"
echo ""
echo "🚀 Starting backend..."
cd /Users/spartan/projects/TAXi/backend
python3 app.py > /tmp/taxi_backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
echo "Backend logs: tail -f /tmp/taxi_backend.log"
sleep 3

echo ""
echo "🚀 Starting frontend..."
cd /Users/spartan/projects/TAXi/frontend
VITE_API_URL=http://localhost:5001 npm run dev > /tmp/taxi_frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"
echo "Frontend logs: tail -f /tmp/taxi_frontend.log"
sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "📊 Status:"
echo "  Backend:  http://localhost:5001 (PID: $BACKEND_PID)"
echo "  Frontend: http://localhost:3001 (PID: $FRONTEND_PID) [will use 3001 if 3000 is busy]"
echo ""
echo "📝 View logs:"
echo "  Backend:  tail -f /tmp/taxi_backend.log"
echo "  Frontend: tail -f /tmp/taxi_frontend.log"
echo ""
echo "🧪 Test backend:"
curl -s http://localhost:5001/health | python3 -m json.tool
echo ""
echo ""
echo "🌐 Open browser to: http://localhost:3001"
