# Still Waters

Still Waters is a Christian devotional and chat application designed to provide spiritual guidance, daily encouragement, and answers to faith-based questions.

## Features

- **Daily Streams**: A unique daily devotional for every day of the year (365 days), ensuring fresh content daily.
- **The Guide**: An AI-powered chat assistant for biblical guidance, offering theological insights and scripture references.
- **The Well**: A curated list of Frequently Asked Questions (FAQs) about Christianity.
- **The Pond**: A personal journal for reflection.
- **Profile**: User profile management.

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express (Proxy for Gemini API)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Supabase Account
- Google Cloud Account (for Gemini API)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd stillwaters
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    cd backend && npm install && cd ..
    ```

3.  **Environment Setup**:
    - Create a `.env` file in the root directory:
      ```
      SUPABASE_URL=your_supabase_url
      SUPABASE_ANON_KEY=your_supabase_anon_key
      API_URL=http://localhost:3000 # Or your production backend URL
      ```
    - Create a `.env` file in the `backend` directory:
      ```
      GEMINI_API_KEY=your_gemini_api_key
      ```

4.  **Run the App**:
    - Start the backend:
      ```bash
      node backend/index.js
      ```
    - Start the frontend:
      ```bash
      npx expo start
      ```

## Deployment Guide

### 1. Backend Deployment (Vercel)

The backend is configured for Vercel deployment using `backend/vercel.json`.

1.  Install Vercel CLI: `npm i -g vercel`
2.  Navigate to the `backend` directory: `cd backend`
3.  Deploy:
    ```bash
    vercel
    ```
4.  Set Environment Variables in Vercel Dashboard:
    - `GEMINI_API_KEY`
5.  Copy the production URL provided by Vercel (e.g., `https://stillwaters-backend.vercel.app`).

### 2. Frontend Configuration

1.  Update your root `.env` file with the production backend URL:
    ```
    API_URL=https://your-backend-url.vercel.app
    ```
2.  Update `app.json`:
    - Ensure `bundleIdentifier` (iOS) and `package` (Android) are unique (e.g., `com.yourname.stillwaters`).
    - Increment `version` and `buildNumber`/`versionCode` for updates.

### 3. App Store Submission (iOS)

1.  **Apple Developer Account**: Ensure you have an active account.
2.  **EAS Build**:
    - Install EAS CLI: `npm install -g eas-cli`
    - Login: `eas login`
    - Configure: `eas build:configure`
3.  **Build for Production**:
    ```bash
    eas build --platform ios
    ```
4.  **Submit**:
    - Once the build is complete, upload it to App Store Connect via Transporter or EAS Submit:
      ```bash
      eas submit -p ios
      ```

### 4. Google Play Store Submission (Android)

1.  **Google Play Console**: Ensure you have an account.
2.  **Build for Production**:
    ```bash
    eas build --platform android
    ```
3.  **Submit**:
    - Upload the `.aab` file to the Google Play Console.

## License

[MIT](LICENSE)
