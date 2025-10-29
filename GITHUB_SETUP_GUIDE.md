# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `istanbul-coastline-atlas`
   - **Description**: `Interactive map and participatory archive of Istanbul's coastlines with geolocated text boxes, contributions, and media features`
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize this repository with a README"
5. Click **"Create repository"**

## Step 2: Initialize Git and Push Code

After creating the repository on GitHub, run these commands in your terminal:

### Initialize Git Repository
```bash
cd "c:\Users\gibra\Downloads\istanbul-coastline-atlas-4b27e368-main\istanbul-coastline-atlas-4b27e368-main"
git init
```

### Add All Files
```bash
git add .
```

### Create Initial Commit
```bash
git commit -m "Initial commit: Istanbul Coastline Atlas with text box feature"
```

### Add Remote Repository
Replace `YOUR_USERNAME` with your GitHub username:
```bash
git remote add origin https://github.com/YOUR_USERNAME/istanbul-coastline-atlas.git
```

### Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your project files uploaded

## Alternative: Using GitHub Desktop

If you prefer a GUI:

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. Click **"Add"** → **"Add Existing Repository"**
4. Browse to: `c:\Users\gibra\Downloads\istanbul-coastline-atlas-4b27e368-main\istanbul-coastline-atlas-4b27e368-main`
5. Click **"Create Repository"**
6. Click **"Publish repository"** in the top bar
7. Choose repository name and visibility
8. Click **"Publish Repository"**

## What's Included in This Project

- ✅ React + Vite application
- ✅ Interactive Leaflet map with Istanbul coastline
- ✅ Geolocated text box feature (add, view, delete)
- ✅ Contribution system
- ✅ Drawing tools
- ✅ Media player integration
- ✅ Multi-language support (Turkish/English)
- ✅ Tailwind CSS + shadcn/ui components
- ✅ LocalStorage persistence

## Important Notes

- The `node_modules` folder will NOT be pushed (it's in .gitignore)
- Environment variables and API keys are safe
- After cloning, others will need to run `npm install` to get dependencies
