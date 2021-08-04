// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

import '../css/style.css';
import './components/img-components.js';
import createResultContainer from './components/result-components.js'
import * as apiRequest from './components/api-components.js'


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
const regex = /^((http|https):\/\/)?(www.)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]+(\/[a-zA-Z0-9_-]+)+(\/[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)?(\/)?$/gm

let displayData = [];


// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
// ArticleURL(url) - Object function for UI input of News article's URL
// executeUserRequest() - Execute News article's evaluation request
// displayResults() - Display results fetched via API calls in UI
// ----------------------------------------------------------------------------


function ArticleURL(url) {
  this.url = url;
}

async function executeUserRequest() {
  apiRequest.postAsync('/api/evaluateURL', new ArticleURL(articleURL.value))
    .then(async (postJson) => {
      console.log('Fetching Related News');
      displayData = await apiRequest.getAsync('/api/getRelatedNews');
      displayResults();
    });
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


// ----------------------------------------------------------------------------
// Add Event Listener to UI btn Evaluate
// ----------------------------------------------------------------------------

evaluateBtn.addEventListener("click", () => {
  if (regex.test(articleURL.value)) {
    executeUserRequest();
  } else {
    alert("URL missing. Please try again!");
  }
  // executeUserRequest();
});
