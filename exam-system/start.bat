@echo off
title Exam System Launcher
color 0A

echo ============================================
echo   Dynamic Online Examination System
echo ============================================
echo.

echo [1/3] Starting MongoDB...
start "MongoDB" cmd /k "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend Server...
start "Backend" cmd /k "cd /d C:\FSD\exam-system\backend && node server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Opening Browser...
timeout /t 2 /nobreak >nul
start "" "http://localhost:5000"

echo.
echo ============================================
echo   App is running at http://localhost:5000
echo   Close the MongoDB and Backend windows
echo   to shut down the server.
echo ============================================
echo.
pause
