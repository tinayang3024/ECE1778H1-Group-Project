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
* <todo: to be added by Renli>

### Page Layout

The app UI is organized into five main screens, each with distinct features:

* **Login Screen**

  * OAuth-based login through supported third-party providers (e.g., Google)
  * Redirects to Home Screen after successful login

* **Home Screen**

  * Displays a featured recipe list fetched from a public API
  * Each recipe card is clickable to view the full recipe details
  * A button to `add new recipe`
  * A button to `view collection`

* **Add Recipe Screen**

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


### Advanced Features

Other than the core features provided by the Recipe Mobile App, there are two advanced features worth highlighting: user authentication with OAuth social login, and recipe sharing through social platforms.

#### User Authentication

The app will implement OAuth-based social logins (e.g., Google, Facebook, GitHub) using Expo’s `AuthSession`, allowing users to sign in securely without creating a separate password. After authentication, the provider issues an access token that the app stores to identify the user and load their personal data, such as collections or liked recipes. Logging out invalidates the token and redirects back to the login page. This approach simplifies onboarding, increases security, and ensures users enjoy a personalized experience.

#### Social Sharing

The Recipe Mobile App will also enable recipe sharing through Expo’s `Sharing` API, letting users send recipe details (title, instructions, and links) directly to social media or messaging apps. With one tap, users can share a favorite dish with friends or family, making cooking a social and collaborative activity. This feature not only improves user engagement but also helps promote the app organically as recipes are shared across different platforms.


## Tentative Plan

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


