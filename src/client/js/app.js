// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

import '../css/style.css';
import './components/img-components.js';
import createResultContainer from './components/result-components.js'

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const articleURL = document.getElementById("ui-url");
const evaluateBtn = document.getElementById("ui-submit");
const resultSection = document.getElementById("result");
const ctaSection = document.getElementById("cta");
const webPageBody = document.body;
const regex = /^((http|https):\/\/)?(www.)?[a-zA-Z0-9_-]+\.[a-zA-Z]+(\/[a-zA-Z0-9_-]+\/?)*$/gm;

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
    return json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

function ArticleURL(url) {
  this.url = url;
}

function displayResults() {

  console.log(displayData);

  ctaSection.style.display = 'none';
  resultSection.style.display = 'block';
  webPageBody.style.overflow = 'scroll';

  for (let data of displayData) {

    let ignoreKeywords = ["BBC News"];

    if (ignoreKeywords.includes(data.keyword)) {
      continue;
    }

    if (data.status == 'ok') {
      resultSection.appendChild(createResultContainer(data));
    }
  }
}

async function executeUserRequest() {
  postAsync('/api/evaluateURL', new ArticleURL(articleURL.value))
    .then(async (postJson) => {
      console.log('Fetching Related News');
      await getAsync('/api/getRelatedNews');
      displayResults();
    });
}

evaluateBtn.addEventListener("click", () => {
  // if (regex.test(articleURL.value)) {
  //   executeUserRequest();
  // } else {
  //   alert("URL missing. Please try again!");
  // }
  executeUserRequest();
});
