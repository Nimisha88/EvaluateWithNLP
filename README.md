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
* Application is configured with 4 scripts:
  * **Jest Test**: Run Jest tests with command `npm run test`
  * **Dev mode (with Dev Server)**: Run Webpack DevServer with command `npm run dev`
  * **Prod mode**: Run Webpack in production mode with command `npm run build`
  * **Server**: Spin a NodeJS Server to serve application's api requests with command `npm run server`
  * **NOTE**: Server should be run after running webpack


## Application access

  * **Development Mode**: Webpack DevServer automatically spins the app at http://localhost:9090/. It is configured to proxy requests to the NodeJS Server running at port 8080 for application's api requests. Kindly DO NOT access http://localhost:8080/ directly as client folder will be empty for development mode.
  * **Production Mode**: Initiate the application manually using url http://localhost:8080/
  * **NOTE**: It is important to run the NodeJS server using command `npm run server` to fetch API data upon request after running webpack in both development and production mode.


## Folder Structure

* main
  * README.md - Read me file
  * .gitignore - Files that were ignored in commit
  * package.json - Contains list of installable dependencies needed to run the application locally
  * webpack.config.js - Contains Webpack configurations
  * server/server.js - Server side scripting to handle API requests asynchronously
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
