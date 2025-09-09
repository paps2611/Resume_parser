#!/bin/bash

echo "Starting Resume Parser Development Environment..."

echo ""
echo "Starting Backend..."
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo ""
echo "Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Development servers starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
