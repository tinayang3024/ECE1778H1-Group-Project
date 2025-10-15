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

* Integration with external recipe backend APIs to deliver a wide variety of worldwide recipes from external databases directly to users within the app (e.g., [TheMealDB](https://www.themealdb.com/api.php)).
* Allows user-defined custom recipe and includes a Save Recipe button that stores the recipe locally via Async Storage.
* Displaying the complete information of a select recipe on the Recipe Detail Screen, and includes a functionality for users to like recipe (stores it locally to user's liked list) using Async Storage for persistent data storage across app.
* Displaying of the user's saved/liked recipes list on the User Collection Screen.
* Integration with Expo Notifications to provide a daily reminder around dinner time for users to explore the recipes, encouraging user engagements with the app.
* Deployment using Expo EAS Build to enable testing the app for both iOS and Android without requiring local setups.

#### Navigation Structure
Expo Router is chosen over React Navigation for this project because its file-based routing reduces boilerplate, simplifies dynamic route handling, and integrates seamlessly with Expo and TypeScript, making it easier to maintain and scale for a project of this size. The approach ensures type-safe route parameters, predictable screen transitions, and a highly organized project structure, improving both developer experience and code readability.

The app uses Expo Router to implement navigation, leveraging its file-based routing system for a clean and organized project structure. Each main screen is represented as a file under the main `app/` directory, such as `app/Login.tsx`, `app/Home.tsx`, `app/AddRecipe.tsx`, `app/RecipeDetails/[id].tsx`, and `app/UserCollection.tsx`. Dynamic routes, like `[id].tsx`, enable passing data (e.g., recipe IDs) directly via the URL to display detailed information for a selected recipe. Shared layouts can be defined in `app/_layout.tsx` to include common UI elements such as headers, footers, or navigation bars across multiple screens, ensuring a consistent look and feel.

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
  * A button to `like recipe`, saving it to the user’s collection
  * A button to return to Home Screen

* **User Collection Screen**

  * Displays a list of all recipes liked or saved by the user
  * Each recipe in the list is clickable to open the Recipe Details Screen
  * Optional: If supported by OAuth, display basic user details (e.g., profile photo, username, email)
  * A button to return to Home Screen

* **Personal Profile Screen**

  * Displays the user’s personal information after login
  * Shows total number of collected recipes
  * Includes a button to `view collection`, routing to the **User Collection Screen**

#### State Management and Persistence
The app manages its state using a combination of React Context API and the useReducer hook, providing a structured yet lightweight solution for handling module-level or medium-complexity state such as user preferences, theme settings, and recipe collections. Context is primarily used as a dependency injection mechanism, allowing shared data and functions to be accessed throughout the app without excessive prop drilling. This approach is effective for moderate data flows but may not scale efficiently for very large or frequently updated global states.
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


---

### Timeline Discussion
The implemented features — including the recipe browsing and creation, detailed recipe views, user collection management, local persistence with Async Storage, daily notifications, Expo Router-based navigation, and the two advanced features of OAuth-based login and social sharing — collectively satisfy the course project requirements by demonstrating core mobile app front end development skills, state management, and user interaction design. The project scope is well-defined and moderate, focusing on five primary screens and key functionalities that are achievable within the 8-week timeframe, allowing sufficient time for design, implementation, testing, and iteration. By leveraging Expo Router for file-based navigation, React Context and Async Storage for state and persistence, and Expo Notifications for user engagement, the project balances feature richness with development feasibility, ensuring a polished and functional app by the course deadline.

#### Tentative Plan

The following table presents a tentative plan for the development of the Recipe Mobile App, assuming a total project timeline of approximately 2 months (8 weeks). The schedule outlines key phases, tasks, estimated effort, and assigned owners for each component of the project. 

<table class="tg">
  <thead>
    <tr>
      <th>Project Phase</th>
      <th>Tasks</th>
      <th>Owner</th>
      <th>Estimated Effort</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="1">General framework & functionality</td>
      <td>Page layout, navigation, states with hardcoded data</td>
      <td>Team</td>
      <td>2 weeks</td>
    </tr>
    <tr>
      <td rowspan="1">Notification</td>
      <td>Implement cooking reminders</td>
      <td>Renli</td>
      <td>0.5 week</td>
    </tr>
    <tr>
      <td rowspan="1">Backend integration</td>
      <td>Connect to external recipe API (TheMealDB)</td>
      <td>Renli</td>
      <td>1 week</td>
    </tr>
    <tr>
      <td rowspan="2">Advanced features</td>
      <td>OAuth implementation</td>
      <td>Tina</td>
      <td>1 week</td>
    </tr>
    <tr>
      <td>Social sharing functionality</td>
      <td>Tina</td>
      <td>0.5 week</td>
    </tr>
    <tr>
      <td rowspan="1">Testing & deployment</td>
      <td>Final end-to-end testing & bug fixing</td>
      <td>Team</td>
      <td>1 week</td>
    </tr>
    <tr>
      <td rowspan="1">Deployment</td>
      <td>Final app deployment (Expo EAS build)</td>
      <td>Tina</td>
      <td>0.5 week</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Total</strong></td>
      <td><strong>6.5 weeks</strong></td>
    </tr>
  </tbody>
</table>

While the total planned effort sums to 6.5 weeks, additional buffer time has been intentionally left to accommodate unexpected challenges, debugging, and preparation for the final presentation, ensuring the project can be completed smoothly within the overall timeframe.


