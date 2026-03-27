@echo off
title Exam System Launcher
color 0A

echo ============================================
echo   Dynamic Online Examination System
echo   Database: MySQL
echo ============================================
echo.

echo [1/3] Checking MySQL Server...
sc query MySQL80 | findstr "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
  echo Starting MySQL Service...
  net start MySQL80
  timeout /t 3 /nobreak >nul
) else (
  echo MySQL is already running.
)

echo.
echo [2/3] Starting Backend Server...
start "Backend - ExamSystem" cmd /k "cd /d C:\FSD\exam-system\backend && node server.js"
timeout /t 4 /nobreak >nul

echo.
echo [3/3] Opening Browser...
start "" "http://localhost:5000"

echo.
echo ============================================
echo   App is running at http://localhost:5000
echo.
echo   Login Credentials:
echo   Admin:   admin@exam.com  / admin123
echo   Student: alice@exam.com  / student123
echo   Student: bob@exam.com    / student123
echo.
echo   To stop: Close the Backend window
echo ============================================
echo.
pause
