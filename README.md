# Yoga POS - Mobile Application

A comprehensive Point of Sale and Business Management System for Yoga Studios, built with React Native for iOS and Android.

## 📱 Overview

Yoga POS Mobile is an enterprise-grade mobile application that provides:

- 🏪 Multi-branch management
- 💳 Complete Point of Sale system
- 📦 Inventory & product management
- 👥 Customer relationship management (CRM)
- 💰 Financial management & reporting
- 📊 Advanced analytics & reporting
- 🖨️ Hardware integration (printers, scanners, cash drawer)
- 🌍 Multi-language & multi-currency support

## 🚀 Tech Stack

### Core
- **React Native** 0.76.5 - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React** 18.3.1 - UI library

### Navigation
- **React Navigation** - Navigation library
  - Native Stack Navigator
  - Bottom Tabs Navigator

### State Management
- **Zustand** 5.0.8 - Lightweight state management
- **Immer** - Immutable state updates
- **React Query** - Server state management and caching

### API & Data
- **Axios** - HTTP client with interceptors
- **React Query** - Data fetching and caching

### Security
- **React Native Keychain** - Secure token storage (iOS Keychain / Android Keystore)
- **React Native Encrypted Storage** - Encrypted local storage

## 📁 Project Structure

```
yoga-pos-mobile/
├── src/
│   ├── api/                    # API services and client
│   │   ├── client.ts          # Axios client with interceptors
│   │   └── services/          # API service modules
│   ├── assets/                 # Static assets
│   ├── components/            # Reusable components
│   ├── config/                # App configuration
│   ├── constants/             # Constants and theme
│   ├── navigation/            # Navigation setup
│   ├── screens/               # Screen components
│   ├── services/              # Business logic services
│   ├── store/                 # State management
│   └── types/                 # TypeScript types
├── .env                        # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment
  - For iOS: macOS with Xcode
  - For Android: Android Studio with SDK

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Edit `.env` with your API endpoint:
   ```
   API_BASE_URL=https://api.yourdomain.com/api/v1
   ```

3. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the application**

   For iOS:
   ```bash
   npm run ios
   ```

   For Android:
   ```bash
   npm run android
   ```

## 🎨 Design System

### Color Palette

#### Primary (Sky Blue)
- Primary 500: `#0ea5e9` - Main brand color

#### Secondary (Purple)
- Secondary 500: `#a855f7` - Accent color

#### Semantic Colors
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

## 📚 Key Features

### 1. Authentication
- Email/Password login
- PIN-based quick login
- Biometric authentication (Face ID, Touch ID)
- Secure token storage with automatic refresh

### 2. Dashboard
- Real-time statistics
- Revenue tracking
- Quick actions panel

### 3. Point of Sale (POS)
- Product catalog
- Barcode scanning
- Multiple payment methods
- Receipt generation

### 4. Inventory Management
- Stock tracking
- Low stock alerts
- Inter-branch transfers

### 5. Customer Management (CRM)
- Customer profiles
- Purchase history
- Loyalty program

## 🔐 Security

- Secure token storage using iOS Keychain and Android Keystore
- Automatic token refresh
- Encrypted local storage for sensitive data

## 📱 Hardware Support

- Camera for barcode/QR scanning
- Bluetooth thermal printers
- Biometric sensors

## 🧪 Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## 📄 License

Proprietary - All rights reserved

---

**Version:** 1.0.0
**Last Updated:** 2025-11-07
