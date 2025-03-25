#!/bin/bash

echo "===== Simple CodeSnap Deployment ====="

# Create a minimal build directory
mkdir -p dist

# Copy the static landing page
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>CodeSnap</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #1e293b;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .btn {
            background-color: #3b82f6;
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.1rem;
            margin-top: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="logo">⚡️</div>
    <h1>CodeSnap</h1>
    <p>Learn coding through interactive puzzles</p>
    <p>Coming soon to your iPhone!</p>
    <a href="#" class="btn" id="installBtn">Add to Home Screen</a>

    <script>
        // Show install instructions for iOS
        document.getElementById('installBtn').addEventListener('click', function(e) {
            e.preventDefault();
            alert('To install CodeSnap on your iPhone:\n\n1. Tap the share button at the bottom of your screen\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner');
        });
    </script>
</body>
</html>
EOL

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check for remote
HAS_REMOTE=$(git remote -v | grep -c "origin" || echo "0")
if [ "$HAS_REMOTE" -eq "0" ]; then
    echo "⚠️ No git remote found."
    echo "Please run: git remote add origin https://github.com/YOUR_USERNAME/CodeSnap.git"
    echo "Then run this script again."
    exit 1
fi

# Create gh-pages branch and push
echo "Deploying to GitHub Pages..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
git checkout -B gh-pages
find . -maxdepth 1 -not -path "./.git" -not -path "./dist" -not -path "." -exec rm -rf {} \;
cp -R dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
git checkout $CURRENT_BRANCH || git checkout main

echo "===== Deployment Complete ====="
echo "Your app will be available at: https://YOUR_USERNAME.github.io/CodeSnap/"
echo ""
echo "To view on your iPhone:"
echo "1. Open the URL in Safari"
echo "2. Tap the Share button (box with up arrow)"
echo "3. Scroll down and tap 'Add to Home Screen'"
echo "4. Tap 'Add' to create the app icon" 