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

* Integration with external recipe backend APIs to deliver a wide variety of worldwide recipes directly to users within the app.
* Allows user-defined custom recipe and includes a Save Recipe button that stores the recipe locally via Async Storage.
* Displaying the complete information of a select recipe on the Recipe Detail Screen, and includes a functionality for users to like recipe (stores it locally to user's liked list) using Async Storage for persistent data storage across app.
* Displaying of the user's saved/liked recipes list on the User Collection Screen.
* Integration with Expo Notifications to provide a daily reminder around meal times for users to explore the recipes, encouraging user engagements with the app.
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
 │   └─ recipeDetails.tsx        ← Recipe Details Screen
 └─ login.tsx                    ← Login Screen (default entry page)
 └─ _layout.tsx                  ← root layout and global gatekeeper
```

#### Page Layout

The app UI is organized into five main screens, each with distinct features:

* **Login Screen**

  * OAuth-based login through supported third-party providers (e.g., Google)
  * Redirects to Home Screen after successful login

* **Dashboard Screen**

  * Displays a featured recipe list fetched from a public API
  * Each recipe card is clickable to view the full recipe details
  * A button to `add new recipe`
  * A button to `view collection`

* **New Recipe Screen**

  * Redirects from the `add new recipe` button on the Home Screen
  * Input fields for entering recipe details including:

    * Title
    * Category
    * Area (cuisine type)
    * Instructions
    * Ingredients with corresponding measurements
  * A button to `save recipe`, storing it in the user’s collection

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

* **User Collection Screen**

  * Displays a list of all recipes liked or saved by the user
  * Each recipe in the list is clickable to open the Recipe Details Screen
  * A button to return to Home Screen
  * Able to remove saved/liked recipes from here.  

* **Personal Profile Screen**

  * Displays the user’s personal information after login
  * Shows total number of collected recipes
  * Includes a button to `view collection`, routing to the **User Collection Screen**

#### State Management and Persistence
The app manages its state using a combination of the React Context API and the useReducer hook, providing a structured yet lightweight solution for handling module-level or medium-complexity state such as user authentication, preferences, theme settings, and recipe collections. Context serves primarily as a dependency injection mechanism, enabling shared data and functions to be accessed across multiple screens without the need for excessive prop drilling. The main context logic is implemented in `context/AuthContext.tsx`, which centralizes user authentication state and provides context values and methods (e.g., login status, user info, and sign-in/sign-out handlers) to components throughout the app. This setup ensures that authentication and user-related data remain consistent across navigations, even when switching between tabs or screens.

Data persistence is achieved through React Native Async Storage, ensuring that important user data—such as saved recipes, liked items, and user preferences—remains available across app restarts. This enhances user experience by maintaining continuity even when the app is closed or restarted, without the need for a backend database.

#### Notification
The app integrates Expo Notifications to provide a daily local reminder that encourages user engagement. A scheduled notification is configured to trigger once per day at approximately 6:00 PM, reminding users to open the app and get inspired with a new recipe idea for dinner. The notification system leverages Expo’s notification scheduling API, which allows the app to register notifications locally on the device without requiring a backend service. Additionally, the implementation includes user interaction handling, ensuring that when a user taps on a notification, the app navigates to the Home Screen (or another relevant page) to display new or featured recipes. Permissions for notifications are requested during the app’s initial launch, and scheduling is managed through an asynchronous setup using Expo’s `Notifications.scheduleNotificationAsync()` API.

#### Backend Integration

The app integrates with external recipe backend APIs to provide users with a diverse collection of recipes from global databases, primarily through [TheMealDB](https://www.themealdb.com/api.php). This API delivers comprehensive recipe data, including category (e.g., Dessert), area (e.g., British), title (e.g., Apple Frangipan Tart), detailed cooking instructions, ingredient lists, and corresponding measurements. The backend responses are parsed and processed into a structured list of class-based recipe objects, ensuring consistent data handling across the app. These objects are rendered dynamically on the Dashboard (Home) Screen, allowing users to explore and interact with the curated recipe collection. The same shared list will also be leveraged on the User Collection Screen to retrieve and display any recipes the user has liked or saved.

#### Deployment with Expo EAS Build
The app will be built and deployed using Expo EAS Build, which provides a cloud-based continuous integration and delivery (CI/CD) workflow for React Native projects. During development, the app will be tested locally through Expo Go and on the iOS emulator to verify UI responsiveness and core functionality. Once stable, EAS Build will be used to generate standalone `.ipa` and `.apk` files for testing on physical devices.
The project will use EAS CLI commands such as `eas build --platform ios` for production builds, with configuration managed in the `eas.json` file. The final workable test builds will be attached as part of the final project submission. This approach ensures smooth testing, validation, and iteration before final submission.

#### Advanced Features

Other than the core features provided by the Recipe Mobile App, there are two advanced features worth highlighting: user authentication with OAuth social login, and recipe sharing through social platforms.

##### User Authentication

The app will implement OAuth-based social logins (e.g., Google, Facebook, GitHub) using Expo’s `AuthSession`, allowing users to sign in securely without creating a separate password. After authentication, the provider issues an access token that the app stores to identify the user and load their personal data, such as collections or liked recipes. Logging out invalidates the token and redirects back to the login page. This approach simplifies onboarding, increases security, and ensures users enjoy a personalized experience.

##### Social Sharing

The Recipe Mobile App will also enable recipe sharing through Expo’s `Sharing` API, letting users send recipe details (title, instructions, and links) directly to social media or messaging apps. With one tap, users can share a favorite dish with friends or family, making cooking a social and collaborative activity. This feature not only improves user engagement but also helps promote the app organically as recipes are shared across different platforms.


## Technical Stack
TBD

## User Guide
TBD

## Video Demo
https://www.youtube.com/watch?v=6QOHw9LwyNU

## Development Guide
TBD

## Deployment Information



##  Individual Contributions

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
      <td rowspan="1">Notification</td>
      <td>Implement cooking reminders</td>
      <td>Renli</td>
    </tr>
    <tr>
      <td rowspan="1">Backend integration</td>
      <td>Connect to external recipe API (TheMealDB)</td>
      <td>Team</td>
    </tr>
    <tr>
      <td rowspan="2">Advanced features</td>
      <td>OAuth implementation</td>
      <td>Dingyu</td>
    </tr>
    <tr>
      <td>Social sharing functionality</td>
      <td>Dingyu</td>
    </tr>
    <tr>
      <td rowspan="1">Testing & deployment</td>
      <td>Final end-to-end testing & bug fixing</td>
      <td>Team</td>
    </tr>
    <tr>
      <td rowspan="1">Deployment</td>
      <td>Final app deployment (Expo EAS build)</td>
      <td>Dingyu</td>
    </tr>
     <tr>
      <td rowspan="3">Presentation and Cleanup</td>
      <td>Presentation Slides</td>
      <td>Team</td>
    </tr>
    <tr>
      <td>Demo Recording</td>
      <td>Dingyu</td>
    </tr>
    <tr>
      <td>README Updates</td>
      <td>Renli</td>
    </tr>
  </tbody>
</table>

## Lessons Learned and Concluding Remarks
TBD


