# RepVault — GitHub Pages Deployment Guide

## Step 1: Create a New GitHub Repository

1. Go to **github.com** → click **+** (top right) → **New repository**
2. Name it: `repvault`
3. Set to **Public** (required for free GitHub Pages)
4. Check **"Add a README file"**
5. Click **Create repository**

---

## Step 2: Upload the App Files

1. In your new repo, click **"Add file"** → **"Upload files"**
2. Drag and drop ALL 5 files from the repvault folder:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
3. Type a commit message like: `Initial RepVault build`
4. Click **"Commit changes"**

---

## Step 3: Enable GitHub Pages

1. In your repo, go to **Settings** (top tab bar)
2. Scroll down to **"Pages"** in the left sidebar
3. Under **"Source"**, select **"Deploy from a branch"**
4. Under **"Branch"**, select **main** and **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes. Your site will be live at:

   ```
   https://YOUR-USERNAME.github.io/repvault/
   ```

---

## Step 4: Add to iPhone Home Screen

1. Open **Safari** on your iPhone
2. Go to `https://YOUR-USERNAME.github.io/repvault/`
3. Tap the **Share** button (square with arrow)
4. Scroll down → tap **"Add to Home Screen"**
5. Name it **RepVault** → tap **Add**

The app will now launch fullscreen (no Safari bar) with the cyan shield icon.

---

## Step 5: Verify Everything Works

- [ ] App opens fullscreen from home screen (no browser bar)
- [ ] Timer runs and audio pips play on countdown
- [ ] Lock your phone during a rest timer — timer should continue
- [ ] Lock screen shows exercise name and time remaining
- [ ] Data persists after closing and reopening
- [ ] Blueprints save and load correctly

---

## Updating the App

When you want to update RepVault:

1. Go to your repo on GitHub
2. Click on `index.html`
3. Click the **pencil icon** (edit)
4. Paste the updated code
5. Click **"Commit changes"**
6. Wait 1–2 minutes for GitHub Pages to redeploy
7. On your phone, open RepVault and pull to refresh (or clear cache)

---

## Troubleshooting

**App won't install as PWA / no "Add to Home Screen":**
- Make sure you're using **Safari** (not Chrome on iOS)
- Ensure all 5 files are in the repo root (not in a subfolder)

**Timer stops when screen locks:**
- The silent audio heartbeat should keep it alive
- Make sure your phone's silent switch is OFF for audio cues
- If issues persist, check Settings → Safari → allow background audio

**Data disappeared:**
- Data is stored in localStorage, which is per-domain
- If you change the GitHub Pages URL, data won't carry over
- Use the Export feature to back up your data as JSON

**Old cached version showing:**
- Hard refresh: open the URL in Safari, tap the refresh icon
- Or: Settings → Safari → Clear History and Website Data (nuclear option)
