// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

import '../css/style.css';
import './components/img-comp.js';

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const articleURL = document.getElementById("ui-url");
const evaluateBtn = document.getElementById("ui-submit");

let displayData = [];

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// HTTP Get/Post request to Server
// ----------------------------------------------------------------------------
// postAsync(url = '', data = {}) - Post new Journal entry
// getAsync(url = '') - Get dynamic data of Last Journal entry
// ----------------------------------------------------------------------------

async function postAsync(apiURL = '/api/evaluateURL', data = {}) {
  console.log("URL: " + data);
  const response = await fetch(apiURL, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getAsync(apiURL = '/api/getRelatedNews') {
  const response = await fetch(apiURL);

  try {
    const json = await response.json();
    displayData = json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

function ArticleURL(url) {
  this.url = url;
}

async function executeUserRequest() {
  postAsync('/api/evaluateURL', new ArticleURL(articleURL.value))
    .then((postJson) => {
      console.log('Fetching Related News');
      return getAsync('/api/getRelatedNews');
    })
    .then((getJson) => {
      /* ---------------------- Display Logic ---------------------- */
      // console.log(JSON.stringify(getJson.json()));
      // if (displayData.cod != 200) {
      //   zipCode.value = '';
      //   userFeelings.value = '';
      //   console.log(`Error: ${JSON.stringify(displayData)}`);
      //   alert(`Something went wrong. Please verify Zip Code and try again.`);
      // } else {
      //   userInput.style.display = 'none';
      //   journalEntry.style.display = 'block';
      //   displayWeatherIcon();
      //   displayTemp();
      //   displaySunTimes();
      //   displayDate();
      //   displayUserFeelings();
      // }
    });
}

evaluateBtn.addEventListener("click", () => {
  if (articleURL.value == "") {
    alert("URL missing. Please try again!");
  } else {
    executeUserRequest();
  }
});
