@echo off
title AI Car Scanner Multi-Process Launcher
echo ===================================================
echo  Starting Quant Automotive Lab System Sequence
echo ===================================================
echo.

if not exist backend\node_modules (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist frontend\node_modules (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo [INFO] Launching Backend Server on Port 5000...
start "Car Scanner Backend" cmd /k "cd backend && node server.js"

echo [INFO] Launching Frontend Server via Vite...
start http://localhost:5173
cd frontend
call npm run dev