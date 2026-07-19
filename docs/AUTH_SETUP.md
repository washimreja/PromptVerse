# Authentication Setup Guide

This document explains how to set up OAuth providers (Google, GitHub, Discord, Facebook) for the PromptVerse application.

## 1. General Requirements
For any OAuth provider, you will need to specify a **Callback URL** (sometimes called a Redirect URI).
In local development, this URL is always:
`http://localhost:3000/api/auth/callback/[provider]`

In production, replace `http://localhost:3000` with your actual domain name (e.g., `https://promptverse.com`).

---

## 2. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials** and select **OAuth client ID**.
5. Set Application type to **Web application**.
6. Add your Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy your **Client ID** and **Client Secret**.
8. Paste them into `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## 3. GitHub OAuth Setup

1. Go to your [GitHub Developer Settings](https://github.com/settings/developers).
2. Under **OAuth Apps**, click **New OAuth App**.
3. Fill in the details:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Register application.
5. Generate a new Client Secret.
6. Copy your **Client ID** and **Client Secret**.
7. Paste them into `.env.local` as `GITHUB_ID` and `GITHUB_SECRET`.

---

## 4. Discord OAuth Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and give it a name.
3. Navigate to the **OAuth2** tab in the left sidebar.
4. Add your Redirects:
   - `http://localhost:3000/api/auth/callback/discord`
5. Copy your **Client ID** and **Client Secret**.
6. Paste them into `.env.local` as `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`.

---

## 5. Facebook OAuth Setup

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Create a new App and select **Authenticate and request data from users with Facebook Login**.
3. Navigate to **Facebook Login > Settings** in the left sidebar.
4. Add your Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook`
5. Go to **App Settings > Basic** to find your App ID and App Secret.
6. Copy your **App ID** and **App Secret**.
7. Paste them into `.env.local` as `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET`.

---

## 6. Testing

Once you have added the credentials to your `.env.local` file, restart your Next.js development server. The OAuth buttons on the `/auth` page will now function correctly.
