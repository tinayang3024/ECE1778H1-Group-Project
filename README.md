# Recipe Mobile App

## Team Members

- Dingyu Yang (1003802183 | dingyu.yang@mail.utoronto.ca) 
- Renli Zhang (1005828339 | renli.zhang@mail.utoronto.ca)

## Motivation

The Recipe Mobile App is designed to address the challenges many people face in discovering, organizing, and managing their cooking routines. In an age where recipes are scattered across websites, blogs, and social media, it can be difficult for users to find reliable instructions, keep track of favorites, or record their own culinary creations. By offering a single platform for browsing online recipes, saving personalized collections, and creating custom entries, the app reduces the need for multiple tools and manual note-taking. Additionally, its built-in reminders encourage users to cook at meal times, promoting healthier eating habits and reducing dependence on takeout or processed food. The app appeals to a wide audience—from home cooks eager to expand their skills, to busy individuals seeking meal-planning assistance, to food enthusiasts wanting to document their unique recipes—making it a practical and engaging solution for everyday life.

## Objectives

The Recipe Mobile App aims to empower users by enabling them to search and explore online recipes, create collections of favorites, and document their own recipes with ease. It also provides timely cooking reminders during meal times, ensuring users stay consistent with their cooking habits. By combining discovery, organization, and reminders into one streamlined platform, the app fosters both convenience and creativity in the kitchen.

## Features

### Core Features

The Recipe Mobile App is designed for convenience and engagement, featuring an interface where users can explore recipes from a public API, create and store their own recipes, and save favorites into a personal collection. 

Some of the key features provided by the app include:

* Integration with external recipe backend APIs (TheMealDB) to deliver a wide variety of worldwide recipes directly to users within the app.
* User-defined custom recipe creation with full validation, including title, duration, servings, ingredients, and cooking steps. New recipes are stored locally via AsyncStorage and automatically added to the user's personal collection.
* Complete recipe information displayed on the Recipe Detail Screen, including ingredients, instructions (split by step), servings, duration, and a large recipe image with a local fallback (kitchen.jpg) when no image is available.
* Like/unlike functionality that stores full recipe data (title, image, ingredients, instructions) to the user's personal collection using AsyncStorage for persistent storage across app restarts.
* Personal Collection Screen displays all liked recipes with image previews; recipes can be removed by unliking them from the detail page.
* Integration with Expo Notifications to provide an opt-in daily reminder at 6:00 PM for users to explore dinner recipe ideas, with test notification support.
* Smart navigation: clicking back from recipe details returns to the origin screen (Dashboard or Personal Collection) based on where the recipe was opened.
* Deployment using Expo EAS Build to enable testing the app for both iOS and Android without requiring local setups.

#### Navigation Structure
Expo Router is chosen over React Navigation for this project because its file-based routing significantly reduces boilerplate, simplifies dynamic route handling, and integrates seamlessly with Expo and TypeScript. This ensures type-safe route parameters, predictable screen transitions, and a clean, scalable architecture that improves both developer experience and code readability.

The app’s navigation follows a modular file-based structure under an `app/` directory, where `_layout.tsx` serves as the global layout and gatekeeper for routing. The default entry point is `login.tsx`, which loads when the user first opens the app. A grouped folder `(tabs)` manages tab-based navigation, containing screens such as `index.tsx` (Dashboard), `newRecipe.tsx` (Add Recipe), `personal.tsx` (User Profile), `personalCollection.tsx` (User Collection), and `recipeDetails.tsx` (Recipe Details). Within this group, `app/(tabs)/_layout.tsx` defines and controls the navigation between tabs. Expo Router’s declarative system enables smooth transitions and route parameter passing (e.g., sending a selected recipe ID from the Dashboard to the Recipe Details Screen), while shared layouts like `app/_layout.tsx` ensure consistent headers, navigation bars, and styling across multiple screens.

```
app/
 ├─ (tabs)/
 │   ├─ _layout.tsx              ← manages tab-based navigation
 │   ├─ index.tsx                ← Dashboard (Home) Screen
 │   ├─ newRecipe.tsx            ← Add New Recipe Screen
 │   ├─ personal.tsx             ← User Profile Screen
 │   ├─ personalCollection.tsx   ← User Collection Screen
 │   └─ recipeDetails/
 │       └─ [id].tsx             ← Recipe Details Screen (dynamic route)
 └─ login.tsx                    ← Login Screen (default entry page)
 └─ _layout.tsx                  ← root layout and global gatekeeper
```

#### Page Layout

The app UI is organized into six main screens, each with distinct features:

* **Login Screen**
  * OAuth-based login through supported third-party providers (e.g., Google)
  * Redirects to Dashboard after successful login

* **Dashboard Screen**
  * Displays a featured recipe list fetched from TheMealDB public API
  * Each recipe card shows image preview, title, and brief description
  * Each recipe card is clickable to view the full recipe details
  * Filter options and search bar to search for recipes 
  * Bottom tab navigation to New Recipe and Personal Profile

* **New Recipe Screen**
  * Input fields for entering recipe details with validation:
    * Title (required)
    * Description (optional)
    * Duration (required, e.g., "20 mins")
    * Servings (required, positive integer)
    * Ingredients (required, one per line)
    * Steps (required, one per line)
  * Real-time validation with error messages for invalid inputs
  * Save button (disabled until all required fields are valid)
  * On save: recipe is stored locally (AsyncStorage), auto-liked, and added to personal collection
  * Success screen with large checkmark icon and back button to create another recipe

* **Recipe Details Screen**
  * Displays all information for a selected recipe, including:
    * Category (e.g., Dessert)
    * Area (e.g., British)
    * Title (e.g., Apple Frangipan Tart)
    * Instructions (step-by-step cooking directions)
    * Ingredient list (e.g., butter, flour, sugar)
    * Measurement list (e.g., 175g/6oz)
  * A button to `like recipe`, saving it to the user’s collection or `unlike recipe`, removing it from the user's collection
  * A button to return to Home Screen
  * Fallback UI with friendly message if recipe fails to load

* **Personal Collection Screen**

  * Displays a grid of all liked recipes with image previews and titles
  * Shows a message "You haven't liked any recipes yet" if collection is empty
  * Each recipe card is clickable to open the Recipe Details Screen
  * Recipes disappear from the list immediately when unliked

* **Personal Profile Screen**

  * Displays the user's personal information after login (name, email, profile picture)
  * Shows the total number of collected recipes (synced with CollectedContext)
  * "View My Collection" button routes to the **Personal Collection Screen**
  * Daily notification toggle: user can enable/disable 6:00 PM recipe reminder
  * Displays current notification permission status
  * Logout button for users to sign out

#### State Management and Persistence
The app manages its state using a combination of the React Context API and the useReducer hook, providing a structured yet lightweight solution for handling module-level or medium-complexity state such as user authentication, preferences, theme settings, and recipe collections. Context serves primarily as a dependency injection mechanism, enabling shared data and functions to be accessed across multiple screens without the need for excessive prop drilling. The main context logic is implemented in `context/AuthContext.tsx`, which centralizes user authentication state and provides context values and methods (e.g., login status, user info, and sign-in/sign-out handlers) to components throughout the app. This setup ensures that authentication and user-related data remain consistent across navigations, even when switching between tabs or screens.

Data persistence is achieved through React Native Async Storage, ensuring that important user data—such as saved recipes, liked items, and user preferences—remains available across app restarts. This enhances user experience by maintaining continuity even when the app is closed or restarted, without the need for a backend database.

#### Notification
The app integrates Expo Notifications to provide a daily local reminder that encourages user engagement. A scheduled notification is configured to trigger once per day at approximately 6:00 PM, reminding users to open the app and get inspired with a new recipe idea for dinner. The notification system leverages Expo’s notification scheduling API, which allows the app to register notifications locally on the device without requiring a backend service. Additionally, the implementation includes user interaction handling, ensuring that when a user taps on a notification, the app navigates to the Home Screen (or another relevant page) to display new or featured recipes. Permissions for notifications are requested during the app’s initial launch, and scheduling is managed through an asynchronous setup using Expo’s `Notifications.scheduleNotificationAsync()` API.

#### Backend Integration

The app integrates with external recipe backend APIs to provide users with a diverse collection of recipes from global databases, primarily through [TheMealDB](https://www.themealdb.com/api.php). This API delivers comprehensive recipe data, including category (e.g., Dessert), area (e.g., British), title (e.g., Apple Frangipan Tart), detailed cooking instructions, ingredient lists, and corresponding measurements. The backend responses are parsed and processed into a structured list of class-based recipe objects, ensuring consistent data handling across the app. These objects are rendered dynamically on the Dashboard (Home) Screen, allowing users to explore and interact with the curated recipe collection. The same shared list will also be leveraged on the User Collection Screen to retrieve and display any recipes the user has liked or saved.

#### Deployment with Expo EAS Build
The app was built and deployed using Expo EAS Build, which provides a cloud-based continuous integration and delivery (CI/CD) workflow for React Native projects. During development, the app will be tested locally through Expo Go and on the iOS emulator to verify UI responsiveness and core functionality. Once stable, EAS Build was used to generate standalone `.ipa` and `.apk` files for testing on physical devices.
The project will use EAS CLI commands such as `eas build --platform ios` for production builds, with configuration managed in the `eas.json` file. The final workable test builds will be attached as part of the final project submission. This approach ensures smooth testing, validation, and iteration before final submission.

#### Advanced Features

Other than the core features provided by the Recipe Mobile App, there are two advanced features worth highlighting: user authentication with OAuth social login, and recipe sharing through social platforms.

##### User Authentication

The app will implement OAuth-based social logins (e.g., Google, Facebook, GitHub) using Expo’s `AuthSession`, allowing users to sign in securely without creating a separate password. After authentication, the provider issues an access token that the app stores to identify the user and load their personal data, such as collections or liked recipes. Logging out invalidates the token and redirects back to the login page. This approach simplifies onboarding, increases security, and ensures users enjoy a personalized experience.

##### Social Sharing

The Recipe Mobile App will also enable recipe sharing through Expo’s `Sharing` API, letting users send recipe details (title, instructions, and links) directly to social media or messaging apps. With one tap, users can share a favorite dish with friends or family, making cooking a social and collaborative activity. This feature not only improves user engagement but also helps promote the app organically as recipes are shared across different platforms.

## User Guide

This section provides step-by-step instructions for using each main feature of the Recipe Mobile App.

### Getting Started

#### 1. Login
- Launch the app and you'll be presented with the Login Screen
- Tap the "Sign in with Google" button (or other OAuth provider)
- Follow the OAuth authentication flow in your browser
- Upon successful authentication, you'll be redirected to the Dashboard

#### 2. Browse Recipes (Dashboard)
- The Dashboard displays a curated list of recipes fetched from TheMealDB
- Each recipe card shows:
  - Recipe image (or default kitchen.jpg if unavailable)
  - Recipe title
  - Brief description
- Scroll through the list to explore available recipes
- Tap any recipe card to view its full details

#### 3. View Recipe Details
- From the Dashboard or Personal Collection, tap a recipe card
- The Recipe Details Screen displays:
  - Large recipe image
  - Title, duration, and servings
  - Category and cuisine area
  - Complete ingredient list with measurements
  - Step-by-step cooking instructions
- **Like/Unlike**: Tap the heart icon in the top right
  - Outline heart: not liked
  - Red filled heart: liked (saved to your collection)
- **Share**: Tap the share icon to send the recipe via messaging apps or social media
- **Back**: Tap the back arrow to return to your previous screen (Dashboard or Personal Collection)

#### 4. Create a New Recipe
- From the Dashboard, tap the blue plus button in the bottom navigation
- Fill in the required fields:
  - **Title**: Enter recipe name (required)
  - **Description**: Add a brief description (optional)
  - **Duration**: e.g., "30 mins" (required)
  - **Servings**: Enter a positive number (required)
  - **Ingredients**: List ingredients, one per line (required)
  - **Steps**: List cooking steps, one per line (required)
- The app validates your inputs in real-time and displays error messages if needed
- Tap "Save Recipe" (disabled until all required fields are valid)
- Upon successful save:
  - Recipe is stored locally and automatically added to your Personal Collection
  - You'll see a success screen with a large checkmark
  - Tap the back arrow to create another recipe or navigate elsewhere

#### 5. Manage Your Personal Collection
- From the Dashboard, tap the "Profile" tab in the bottom navigation
- On the Personal Profile Screen, tap "View My Collection"
- The Personal Collection Screen shows:
  - All recipes you've liked or created
  - Each recipe displays an image preview and title
  - Empty state message if you haven't saved any recipes yet
- Tap any recipe to view its details
- To remove a recipe from your collection:
  - Open the recipe details
  - Tap the heart icon to unlike it
  - The recipe will immediately disappear from your collection

#### 6. Enable Daily Notifications
- From the Dashboard, tap the "Profile" tab
- On the Personal Profile Screen, locate the "Notifications" section
- Toggle the "Daily recipe reminder (6:00 PM)" switch to ON
- Grant notification permission when prompted by your device
- The app will now send you a daily reminder at 6:00 PM
- To test: tap the "Test notification" button to receive an immediate notification
- To disable: toggle the switch to OFF

#### 7. View Your Profile
- Tap the "Profile" tab to see your profile information:
  - Profile picture, name, and email (from OAuth login)
  - Total number of collected recipes
  - Notification settings
- Tap "Logout" to sign out and return to the Login Screen

## Video Demo
https://www.youtube.com/watch?v=6QOHw9LwyNU

## Technical Stack

This project is built with Expo and React Native, leveraging TypeScript for type safety and improved developer experience. Navigation is powered by Expo Router, a file-based routing system that simplifies screen management and deep linking. For state management, we use React Context API with custom contexts (CollectedContext, AuthContext, NotificationContext) to manage likes, user profiles, and notification preferences, respectively. User-created recipes and likes are persisted locally using @react-native-async-storage/async-storage, ensuring data survives app restarts. The app integrates expo-notifications and expo-device to handle daily reminder scheduling, permission requests, and Expo push token registration for optional remote notifications. Recipe data is sourced from the TheMealDB external API, with local asset fallbacks (e.g., assets/images/kitchen.jpg) for missing images. Additional libraries include @expo/vector-icons for UI icons and React Native Share API for social sharing capabilities. This stack provides a simple, modular, and scalable architecture suitable for rapid development and testing on both iOS and Android platforms.

## Development Guide

This section provides instructions for setting up the development environment and running the Recipe Mobile App locally.

### Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js (npm) or install [Yarn](https://yarnpkg.com/)
- **Git**: [Download Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/tinayang3024/ECE1778H1-Group-Project.git
cd ECE1778H1-Group-Project/recipe-app
```

### Install Dependencies

Navigate to the `recipe-app` directory and install all required packages:

```bash
cd recipe-app
npm install
```

Or if using yarn:

```bash
yarn install
```

### Key Dependencies

The project uses the following major dependencies (automatically installed via `npm install`):

- **expo**: ~52.0.11
- **react**: 18.3.1
- **react-native**: 0.76.3
- **expo-router**: ~4.0.9
- **@react-native-async-storage/async-storage**: 2.0.0
- **expo-notifications**: ~0.29.9
- **expo-device**: ~6.0.2
- **@expo/vector-icons**: ^14.0.4
- **typescript**: ~5.3.3

### Configure Environment

1. **Set up OAuth credentials (optional, for login)**:
   - If you want to test OAuth login, configure your Google OAuth credentials
   - Update the client IDs in `app.json` or environment variables as needed
   - For development, the app can run without OAuth if you bypass the login screen

2. **Add local assets**:
   - Ensure `assets/images/kitchen.jpg` exists for the default recipe image fallback
   - The repository should include this asset; if missing, add any placeholder image

### Run the Development Server

Run the app directly on emulators/simulators. This compiles the native code and launches the app:

```bash
# Run on iOS simulator (macOS only)
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

**Note**: These commands compile native code and may take a few minutes on first run. Ensure you have:
- iOS Simulator installed (via Xcode on macOS) for iOS
- Android emulator running (via Android Studio) for Android

### Project Structure

```
recipe-app/
├── app/                          # Main application code (Expo Router)
│   ├── (tabs)/                   # Tab-based screens group
│   │   ├── _layout.tsx           # Tab navigation configuration
│   │   ├── index.tsx             # Dashboard (Home) Screen
│   │   ├── newRecipe.tsx         # Create Recipe Screen
│   │   ├── personal.tsx          # User Profile Screen
│   │   ├── personalCollection.tsx # Personal Collection Screen
│   │   ├── recipeDetails/
│   │   │   └── [id].tsx          # Dynamic Recipe Details Screen
│   │   └── _mockRecipes.ts       # Local mock recipes store
│   ├── _layout.tsx               # Root layout (providers, auth gate)
│   └── login.tsx                 # Login Screen
├── components/                   # Reusable UI components
│   ├── RecipeDisplayWrapper.tsx  # Recipe list wrapper
│   ├── RecipeDisplayItem.tsx     # Recipe card component
│   └── ...
├── context/                      # React Context providers
│   ├── AuthContext.tsx           # User authentication state
│   ├── CollectedContext.tsx      # Liked recipes state
│   └── NotificationContext.tsx   # Notification permissions & scheduling
├── utils/                        # Utility functions
│   ├── mealMapper.ts             # TheMealDB API response mapper
│   └── constants.ts              # App-wide constants
├── assets/                       # Static assets (images, fonts)
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── eas.json                      # EAS Build configuration
```

### Building for Production

#### Development Build (for local testing)
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

#### Production Build
```bash
# iOS
eas build --platform ios

# Android  
eas build --platform android
```

Builds are managed via Expo Application Services (EAS). Ensure you have:
- An Expo account (sign up at [expo.dev](https://expo.dev))
- EAS CLI installed: `npm install -g eas-cli`
- Configured `eas.json` (already included in the repository)

## Deployment Information
https://expo.dev/artifacts/eas/hY8FY9dpPAB9yLvPuJsAJg.apk

## Individual Contributions

<table class="tg">
  <thead>
    <tr>
      <th>Project Phase</th>
      <th>Tasks</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="6">General Screen Layout, Navigation, States with hardcoded data</td>
      <td>Login Screen</td>
      <td>Dingyu</td>
    </tr>
   <tr>
      <td>Dashboard Screen</td>
      <td>Dingyu</td>
    </tr>
   <tr>
      <td>Recipe Details Screen</td>
      <td>Renli</td>
    </tr>
   <tr>
      <td>New Recipe Screen</td>
      <td>Renli</td>
    </tr>
   <tr>
      <td>Profile Screen</td>
      <td>Team</td>
    </tr>
   <tr>
      <td>Personal Collection</td>
      <td>Team</td>
    </tr>
    <tr>

## Lessons Learned and Concluding Remarks

### Insights and Reflections

Throughout development, we learned valuable lessons about mobile app architecture and best practices. The project reinforced the importance of iterative development and cross-platform testing, allowing us to identify issues early by building features incrementally. 

Our most significant insight was the adoption of Expo Router. Initially, we considered using traditional React Navigation but during actual development, we decided to switch to Expo Router, which proved to be an excellent decision. The file-based routing paradigm reduced boilerplate code dramatically and made the navigation structure immediately apparent from our project directory layout. Type-safe route parameters and seamless TypeScript integration prevented many potential runtime errors and improved our development velocity. Expo Router's query parameter system enabled us to implement a smart back button feature: since the recipe detail page can be navigated to from dashboard or personal collection, the back button will return the user to the previous page they were on rather than defaulting to a specific one. This context-aware navigation was achieved by passing query parameters (e.g., `?from=personal`) through Expo Router's navigation system, allowing us to maintain navigation context without complex state management.

Another of our insight was recognizing the importance of separating state management concerns. Rather than consolidating all app state within `AuthContext`, we created separate contexts (`CollectedContext` and `NotificationContext`) for feature-specific state like liked recipes and notifications. This modular architecture, where each context has a single, well-defined responsibility, significantly simplified debugging and made extending features more straightforward. Additionally, we learned that persisting complete data objects rather than just identifiers in AsyncStorage eliminated unnecessary API calls and simplified our code, trading minimal storage space for significant performance gains—a worthwhile tradeoff for a local-first mobile application.

### Concluding Thoughts

The Recipe Mobile App project provided a comprehensive learning experience in mobile application development. We successfully delivered a functional app that demonstrates core mobile development skills including state management, data persistence, external API integration, notifications, and cross-platform compatibility. Working with Expo and React Native proved excellent for rapid development, while TypeScript's type safety caught numerous potential bugs during development. Beyond technical achievements, this project reinforced important software engineering principles: modular architecture, user-centered design, comprehensive testing, and clear documentation. The collaborative nature of the project also provided valuable experience in teamwork and iterative development practices. Overall, we think it was a great learning experience and had taught us a lot about modern mobile app development practices.