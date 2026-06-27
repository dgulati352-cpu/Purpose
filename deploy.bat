@echo off
color 0A
echo ===================================================
echo   💖  Deploying Proposal Website to GitHub  💖
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git is not installed or not added to your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b
)

:: Run Git deployment
echo [1/5] Initializing Git repository...
git init

echo.
echo [2/5] Staging files...
git add .

echo.
echo [3/5] Creating commit...
git commit -m "feat: add animated teddy, sounds, dynamic reaction gifs, and runaway button"

echo.
echo [4/5] Setting main branch and remote origin...
git branch -M main
:: Remove remote origin if it already exists to avoid errors
git remote remove origin >nul 2>nul
git remote add origin https://github.com/dgulati352-cpu/Purpose.git

echo.
echo [5/5] Pushing code to GitHub...
echo (You may be prompted by GitHub to sign in/authenticate in your browser...)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo   🎉 Success! Your code is now live on GitHub. 🎉
    echo   You can now connect this repo to Vercel/Netlify!
    echo ===================================================
) else (
    color 0C
    echo.
    echo ===================================================
    echo   ❌ Error occurred during push. Please check the
    echo   error message above and verify your permissions.
    echo ===================================================
)
echo.
pause
