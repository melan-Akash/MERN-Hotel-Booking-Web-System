# Hotel Booking Web System

A modern, feature-rich hotel booking platform built with the MERN stack. This system allows users to search for hotels, view room details, book rooms, and manage their bookings, while admins can manage hotels and bookings.

## Features

### User Features
- **User Authentication**: Register, login, and logout. Password reset functionality (optional).
- **Hotel Search**: Search hotels by name, location, dates, and number of guests.
- **Hotel Details**: View detailed hotel information including description, amenities, policies, and photos.
- **Room Selection**: Browse available rooms, see prices, and select room types.
- **Booking System**:
  - Select check-in and check-out dates.
  - Calculate total price based on dates and room type.
  - Submit booking requests.
  - View booking history.
- **Profile Management**: View and update user profile.
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices.

### Admin Features
- **Admin Dashboard**: Overview of system activities.
- **Hotel Management**: Add, update, delete, and view hotels.
- **Room Management**: Manage room types within hotels.
- **Booking Management**: View and manage all bookings (approve/reject/cancel).
- **User Management**: View and manage users.

## Tech Stack

### Frontend
- **Framework**: React
- **Language**: JavaScript
- **Styling**:
  - **Tailwind CSS**: Utility-first CSS framework.
  - **Heroicons**: Icon set.
  - **React Router**: Client-side routing.
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js + Express
- **Language**: JavaScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Validation**: express-validator

### Tools
- **Package Manager**: npm
- **Development**: nodemon
- **API Testing**: Postman

## Project Structure

```
MERN-Hotel-Booking-Web-System/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Context providers (Auth, Booking)
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main application component
│   └── package.json
├── server/                  # Node.js/Express Backend
│   ├── routes/              # API route definitions
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas
│   ├── middleware/          # Custom middleware (auth, error handling)
│   └── server.js            # Express server entry point
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (local or cloud like MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd MERN-Hotel-Booking-Web-System
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file based on .env.example (if available)
# Configure DATABASE_URL in .env

# Start server
npm start
```

The server will start on `http://localhost:5000` by default.

### 3. Frontend Setup
```bash
cd client
npm install
# Create .env file based on .env.example (if available)
# Configure REACT_APP_API_URL in .env (should point to backend)

# Start development server
npm start
```

The frontend will be available on `http://localhost:3000`.

## Usage

### Default Credentials
- **Admin User**: [EMAIL_ADDRESS] / password123
- **Regular User**: [EMAIL_ADDRESS] / password123

### API Documentation
See the [server/README.md](server/README.md) (or generated API docs) for detailed API endpoints and request/response formats.

## Running in Development
Both the server and client can be run simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

## Building for Production

### Frontend
```bash
cd client
npm run build
```

The production build will be created in the `client/build` folder.

### Backend
No separate build process needed, just run `npm start`.