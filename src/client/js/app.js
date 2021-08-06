// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

import '../styles/style.css';
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
const backCTASection = document.getElementById("back-cta");
const goBackBtn = document.getElementById("ui-back");
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

function reloadPage() {
  let locHref = location.href;
  location.href += '#top';
  window.location.reload();
  location.href = locHref;
}

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
  if(displayData.length != 0) {
    console.log(displayData);
    ctaSection.style.display = 'none';
    resultSection.style.display = 'block';
    webPageBody.style.overflow = 'scroll';
    backCTASection.style.display = 'block';

    for (let data of displayData) {
      let ignoreKeywords = ["BBC News"];
      if (ignoreKeywords.includes(data.keyword)) {
        continue;
      }
      if (data.status == 'ok') {
        resultSection.appendChild(createResultContainer(data));
      }
    }
  } else {
    reloadPage();
    alert("Something went wrong, evaluation was unsuccessful. Please try again.");
  }

}


// ----------------------------------------------------------------------------
// Add Event Listener to UI btn Evaluate
// ----------------------------------------------------------------------------

evaluateBtn.addEventListener("click", () => {
  if (articleURL.value == "") {
    alert("URL missing. Please try again!");
  } else {
    if (regex.test(articleURL.value)) {
      if (window.navigator.onLine) {
        executeUserRequest();
      } else {
        reloadPage();
        alert("You seem to be offline! Please check your network connection and try again.");
      }
    } else {
      console.log(`Incorrect URL: ${JSON.stringify(articleURL.value)}`);
      reloadPage();
      alert("URL incorrect. Please try again!");
    }
  }
});

goBackBtn.addEventListener("click", () => {
  while(resultSection.firstChild) {
    resultSection.removeChild(resultSection.lastChild);
  }
  reloadPage();
});


// ----------------------------------------------------------------------------
// Register Service Worker
// ----------------------------------------------------------------------------

// if ('serviceWorker' in navigator) {
//   window.addEventListener("load", () => {
//     console.log('Registering Service Worker');
//     navigator.serviceWorker.register('service-worker.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       })
//       .catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }
