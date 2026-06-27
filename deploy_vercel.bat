@echo off
color 0D
echo ===================================================
echo   🚀  Deploying Proposal Website to Vercel  🚀
echo ===================================================
echo.

:: Check if Node/NPM is installed (needed for npx)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js and NPM are not installed on your system.
    echo Please install Node.js from https://nodejs.org/ to use this Vercel deployment tool.
    echo.
    echo Alternatively, you can deploy by linking your GitHub repository to Vercel.com in your browser.
    echo.
    pause
    exit /b
)

echo Starting Vercel deployment using npx...
echo (If this is your first time, you will be prompted to log in to Vercel.)
echo.

npx vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo   🎉 Success! Your website is now live on Vercel! 🎉
    echo ===================================================
) else (
    color 0C
    echo.
    echo ===================================================
    echo   ❌ Vercel deployment could not complete.
    echo   Make sure you are logged in and authorized.
    echo ===================================================
)
echo.
pause
