# 🚀 One-Click Deployment Guide

Your subscription tracker app is ready for one-click deployment! Here are the easiest options:

## Option 1: GitHub Pages (Recommended - Free)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/serhateralp01/subs_track.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Your app will automatically deploy on every push to main branch

**Your app will be live at:** `https://serhateralp01.github.io/subs_track/`

## Option 2: Netlify (Free tier)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub account
4. Select your `subscription-tracker` repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

## Option 3: Vercel (Free tier)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite app
5. Click **"Deploy"**

## Option 4: Firebase Hosting (Free tier)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Deploy
```bash
firebase login
firebase init hosting
# Select your project and set public directory to 'dist'
npm run build
firebase deploy
```

## 🎉 That's it!

Your subscription tracker will be live and accessible from anywhere. The app stores data in the browser's localStorage, so it works perfectly as a static site.

## 🔧 Troubleshooting

- **Build fails?** Make sure all dependencies are installed: `npm install`
- **App doesn't load?** Check the browser console for errors
- **Data not saving?** The app uses localStorage - make sure cookies/localStorage is enabled

## 📱 Features That Work Great Online

- ✅ Responsive design works on all devices
- ✅ Data persists in browser localStorage
- ✅ No server required - pure client-side app
- ✅ Fast loading with CDN dependencies
- ✅ Works offline after first load 