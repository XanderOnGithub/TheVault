@echo off
echo Starting build process for The Vault...

:: Step 1: Install Dependencies
echo Installing dependencies...
npm install

:: Step 2: Build the Project
echo Building the project...
npm run build

:: Step 3: Preview the Build
echo Previewing the build...
npm run preview

echo Build process completed successfully!
pause