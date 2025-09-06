# Mobile App Build Instructions

This guide will help you build an APK file for your Habit Realm Quest app using Capacitor.

## Prerequisites

1. **Git** - Make sure you have Git installed
2. **Node.js** - Version 16 or later
3. **Android Studio** - For Android development
4. **GitHub Account** - To export your project

## Step 1: Export to GitHub

1. In the Lovable editor, click the **GitHub** button in the top right
2. Click **"Export to GitHub"** 
3. Create a new repository or select an existing one
4. Wait for the export to complete

## Step 2: Clone and Setup

1. Clone your repository locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Step 3: Initialize Capacitor

Capacitor is already configured in this project. The config file `capacitor.config.ts` includes:
- App ID: `com.millionaireden.app`
- App Name: `Millionaire Den`
- Hot reload URL for development

## Step 4: Add Android Platform

1. Add the Android platform:
   ```bash
   npx cap add android
   ```

2. Sync the project:
   ```bash
   npx cap sync android
   ```

## Step 5: Build APK

### Option A: Using Android Studio (Recommended)

1. Open Android Studio
2. Run the following command to open the project in Android Studio:
   ```bash
   npx cap open android
   ```
3. In Android Studio:
   - Wait for Gradle sync to complete
   - Go to **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

### Option B: Command Line

1. Make sure you have Android SDK and build tools installed
2. Run:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
3. Find your APK in `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 6: Install APK

1. Transfer the APK file to your Android device
2. Enable **"Install from Unknown Sources"** in your device settings
3. Tap the APK file to install

## Development Tips

- **Hot Reload**: The app is configured to connect to your Lovable project for development
- **Production Build**: For a production APK, change the `url` in `capacitor.config.ts` to your deployed app URL
- **Signing**: For Google Play Store, you'll need to sign your APK with a release key

## Troubleshooting

- **Build Errors**: Make sure all dependencies are installed with `npm install`
- **Sync Issues**: Try `npx cap sync android` again
- **Permission Issues**: Check Android permissions in `android/app/src/main/AndroidManifest.xml`

## Updating Your App

After making changes in Lovable:
1. Git pull the latest changes
2. Run `npm run build` 
3. Run `npx cap sync android`
4. Rebuild the APK

For more information, visit: [Capacitor Documentation](https://capacitorjs.com/docs)