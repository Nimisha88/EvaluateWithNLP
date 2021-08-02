// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Global Constants and Variables
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const meaningCloudAPIBaseUrl = "https://api.meaningcloud.com/topics-2.0";
const also = '&';

const NewsAPI = {
  apiBaseUrl: 'https://newsapi.org/',
  endPoint: 'v2/top-headlines?',
  byKeyword: 'q=',
  byCountry: 'country=',
  byCategory: 'category=',
  bySources: 'sources=',
  byPageSize: 'pageSize=', // Default 20, max 100
  apiKey: 'apiKey=',
}

require('dotenv').config(); // Load Environment Variable

const apiKeyMeaningCloud = process.env.MeaningCloudAPIKey; // Store API Key locally
const apiKeyNewsAPI = process.env.NewsAPIKey; // Store API Key locally

const FormData = require('form-data');

const fs = require('fs');
const express = require('express'); // Include Express
const bodyParser = require('body-parser'); // Include Body-parser
const cors = require('cors'); // Include CORS
const fetch = require('node-fetch'); // Include fetch

const app = express(); // Start up an instance of app
const port = 8080; // Port for the server to listen at

const server = app.listen(port, () => {
  console.log(`Running on "localhost:${port}"`);
});

let urlAnalysis;
let keywordSearch = {relatedNews: []};


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Configue App instance
// ----------------------------------------------------------------------------
// configureApp() - Initialise app to use body-parser and cors
// ----------------------------------------------------------------------------

function configureApp() {
  //Configure App Instance
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cors());

  // Initialize the Application Project folder
  app.use(express.static('../client'));
}


// ----------------------------------------------------------------------------
// Process Requests
// ----------------------------------------------------------------------------
// searchKeyword(keyword) - Search a given feed for top headlines via NewsAPI
// processSearchRequest() - Make an API call based on Request data
// getFormData(url) - Gets FormData for the given URL
// analyzeURLRequest(url) - Analyze URL provided by the user
// ----------------------------------------------------------------------------

async function searchKeyword(keyword) {
  console.log(NewsAPI.apiBaseUrl+NewsAPI.endPoint+NewsAPI.byKeyword+keyword+also+NewsAPI.apiKey+apiKeyNewsAPI);
  const response = await fetch(NewsAPI.apiBaseUrl+
                              NewsAPI.endPoint+
                              NewsAPI.byKeyword+keyword+also+
                              NewsAPI.apiKey+apiKeyNewsAPI);

  try {
    const json = await response.json();
    // console.log(JSON.stringify(json));
    return json;
  }
  catch(error) {
    console.log("Error: \n", error);
  }
}

async function processSearchRequest() {
  for (entity of urlAnalysis.entity_list) {
    if (entity.relevance >= 95) {
      console.log(`Searching keyword ${entity.form}`);
      let searchResult = await searchKeyword(entity.form);
      if (searchResult.status == 'ok') {
        fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
        keywordSearch.relatedNews.push(searchResult);
      }
    }
  }
  for (entity of urlAnalysis.concept_list) {
    if (entity.relevance >= 95) {
      console.log(`Searching keyword ${entity.form}`);
      let searchResult = await searchKeyword(entity.form);
      if (searchResult.status == 'ok') {
        fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
        keywordSearch.relatedNews.push(searchResult);
      }
    }
  }
}

function getFormData(url) {
  let meaningCloudFormdata = new FormData();
  meaningCloudFormdata.append('key', apiKeyMeaningCloud); // Meaning Cloud API Key
  meaningCloudFormdata.append('lang', 'en');  // 2-letter language code, like en es fr
  meaningCloudFormdata.append('tt', 'ec'); // Extract all possible topics, a for all
  meaningCloudFormdata.append('uw', 'y'); // Find possible analysis when there are typos
  meaningCloudFormdata.append('url', url);
  return meaningCloudFormdata;
}

async function analyzeURLRequest(url) {
  const response = await fetch(meaningCloudAPIBaseUrl, {
    method: 'POST',
    body: getFormData(url),
    redirect: 'follow'
  });

  try {
    const json = await response.json();
    fs.writeFileSync('./meaningCloudAPIResponse.json', JSON.stringify(json));
    // console.log(JSON.stringify(json));
    return json;
  }
  catch(error) {
    console.log("Error: \n", error);
  }
}


// ----------------------------------------------------------------------------
// Configure Server instance
// ----------------------------------------------------------------------------
// serverMain() - Configures all HTTP request Get/Post
// ----------------------------------------------------------------------------

function serverMain() {
  // Configure App Instance
  configureApp();

  app.get('/api/getRelatedNews', (req, res)=> {
    console.log("Sending Related News Results");
    // res.json(keywordSearch);
    res.send(keywordSearch);
    // res.send({name:"A", work:"1"});
  });

  app.post('/api/evaluateURL', async (req, res)=>{
    console.log("POST received");
    urlAnalysis = await analyzeURLRequest(req.body.url);

    if (urlAnalysis.status.msg == 'OK') {
      keywordSearch = await processSearchRequest();
    }
    res.send({
      msg: 'POST received'
    });
  });
}

serverMain();
