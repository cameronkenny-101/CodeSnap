#!/bin/bash

echo "===== Building and Deploying CodeSnap ====="

# Run the build process
echo "Running npm build..."
npm run build || { echo "❌ Build failed! Exiting."; exit 1; }

# Ensure dist exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed: 'dist' directory not found!"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check for remote repository
HAS_REMOTE=$(git remote -v | grep -c "origin" || echo "0")
if [ "$HAS_REMOTE" -eq "0" ]; then
    echo "⚠️ No git remote found."
    echo "Please run: git remote add origin https://github.com/cameronkenny-101/CodeSnap.git"
    echo "Then run this script again."
    exit 1
fi

# Switch to gh-pages branch
echo "Deploying to GitHub Pages..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
git checkout -B gh-pages

# Remove all files except .git, then copy build output
find . -maxdepth 1 -not -path "./.git" -not -path "./dist" -not -path "." -exec rm -rf {} \;
cp -R dist/* .

# Commit and push
git add .
git commit -m "Deploy built app to GitHub Pages"
git push origin gh-pages --force
git checkout $CURRENT_BRANCH || git checkout main

echo "===== Deployment Complete ====="
echo "Your app will be available at: https://cameronkenny-101.github.io/CodeSnap/"
