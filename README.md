# StillWaters

StillWaters is a Christian wellness application designed to provide a digital sanctuary for peace, reflection, and spiritual growth. It combines modern technology with timeless wisdom to offer users a personalized spiritual companion.

## Features

*   **🌊 Chatbot ("StillWaters")**: An AI-powered spiritual companion (powered by Google Gemini) that answers questions, offers encouragement, and provides biblical wisdom in a conversational format.
*   **📖 Daily Devotional ("Daily Streams")**: A daily curated scripture, reflection, and prayer to start the day with intention.
*   **❓ FAQ ("The Well")**: A library of common spiritual questions and answers for quick guidance.
*   **✍️ Journal ("Reflection Pool")**: A private, secure space for users to document their thoughts, prayers, and spiritual journey.
*   **🔐 Secure Authentication**: User accounts managed securely via Supabase Auth.

## Tech Stack

*   **Frontend**: React Native (Expo), Zustand (State Management), React Navigation
*   **Backend**: Node.js, Express.js
*   **Database & Auth**: Supabase (PostgreSQL)
*   **AI**: Google Gemini API
*   **Testing**: Jest, React Native Testing Library

## Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   Expo Go app (for testing on device) or Android/iOS Simulator
*   Supabase Account
*   Google Cloud Account (for Gemini API key)

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/stillwaters.git
    cd stillwaters
    ```

2.  **Install Frontend Dependencies**
    ```bash
    cd stillwaters
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

## Configuration

### Frontend (.env)
Create a `.env` file in the `stillwaters` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (backend/.env)
Create a `.env` file in the `stillwaters/backend` directory:
```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key
```

## Running the Application

1.  **Start the Backend Server**
    ```bash
    cd stillwaters/backend
    node index.js
    ```

2.  **Start the Expo Development Server**
    ```bash
    cd stillwaters
    npm start
    ```

3.  **Launch on Device/Simulator**
    *   Press `a` for Android Emulator
    *   Press `i` for iOS Simulator
    *   Scan the QR code with Expo Go on your physical device

## Testing

Run the automated test suite:
```bash
npm test
```

## Author

👤: Demmy Idowu
