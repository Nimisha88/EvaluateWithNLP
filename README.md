# Coupled - Extract Topics and Top Headlines

A web tool that allows users to run Natural Language Processing (NLP) on News Articles to extract relevant topics and display their related Top Headlines.


## Application Preview

https://user-images.githubusercontent.com/29170466/128664683-bd594c2d-ae29-4233-ba4c-1432c945a1f8.mov


## Software, Firmware and Hardware

* HTML, CSS, JavaScript
* NodeJS v14.17.3 and latest version of following packages:
  * express, body-Parser, cors, dotenv
  * babel, css-loader, style-loader, mini-css-extract
  * clean-webpack, html-webpack
  * node-fetch, form-data
  * jest, webpack, workbox
  * css-minimizer, terser


## Installation instructions

* Install [NodeJS](https://nodejs.org/)
* Download the application locally and do the following:
  * Obtain an APIKey at [MeaningCloud](https://www.meaningcloud.com/) by creating a free account.
  * Obtain an APIKey at [NewsAPI](https://newsapi.org/) by creating a free account.
  * In the main application folder, create `.env` file and add your APIKey like
    ```
    MeaningCloudAPIKey=your-api-key-here
    NewsAPIKey=your-api-key-here
    ```
* On terminal, `cd` to the main application folder containing `package.json` and install dependencies by running `npm install`


## Application access

* **Test Application**: To run the Jest Tests, run command `npm run test` from the main application folder (containing `package.json`)

* **Development Mode**: To run application in Development Mode, run following commands from the main application folder (containing `package.json`):
  ```
  npm run dev
  npm run server
  ```
  DevServer should automatically spins the application at http://localhost:9090/. It is configured to proxy to Node Server listening at 8080 to serve API data requests.

  *Note*: Webpack dev server does NOT write static files in `dist`, it serves the bundle virtually from the memory. `dist` will be created but will be empty in the development mode. [Read more](https://stackoverflow.com/questions/48936567/webpack-dev-server-does-not-place-bundle-in-dist)

* **Prod mode**: To run application in Production Mode, run following commands from the main application folder (containing `package.json`):
  ```
  npm run prod
  npm run server
  ```
  Initiate the application manually using url http://localhost:8080/

  *Note*: Webpack will write static files in `dist`. `dist` will be created with required webpack bundle files.


## Folder Structure

* main
  * README.md - Read me file
  * .gitignore - Files that were ignored in commit
  * package.json - Contains list of installable dependencies needed to run the application locally
  * webpack.config.js - Contains Webpack dev configurations
  * webpack.prod.js - Contains Webpack prod configurations
  * src/server/server.js - Server side scripting to handle API requests asynchronously
  * src/client
    * views/index.html - Landing page of the application
    * styles/*.css - Styling scripts used in the application
    * image/* - Images used in the application or while testing it
    * js/app.js - Client side scripting
    * js/components/*.js - Scripting components of the application
    * js/jest-test/*.js - JS components test scripts


## Copyright

The application is designed and developed by **Nimisha Viraj** as a part of [Udacity Front End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011).


## Acknowledgements

* [Udacity](https://udacity.com) - Source of application requirements
* [MeaningCloud](https://www.meaningcloud.com/) and [NewsAPI](https://newsapi.org/) - Source of API Data
* [Stackoverflow](https://stackoverflow.com/) - Source of resolutions to coding errors and roadblocks
* [Ivaylo Gerchev](https://www.sitepoint.com/webpack-beginner-guide/) - Author of an excellent tutorial on Webpack
* [CSS-Trick](https://css-tricks.com/) - Inspiration of Page design


## Limitation and Scope

* Service worker implementation impacts the overall speed of the Application
* Fetching Api data is taking approx 12-15 secs to display result/error.
* Application is limited to evaluating URL of news articles only. It can be expanded to accept texts as well.
