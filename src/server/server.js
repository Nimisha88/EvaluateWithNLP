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

// const fs = require('fs');
const express = require('express'); // Include Express
const bodyParser = require('body-parser'); // Include Body-parser
const cors = require('cors'); // Include CORS
const fetch = require('node-fetch'); // Include fetch

const app = express(); // Start up an instance of app
const port = 8080; // Port for the server to listen at

const server = app.listen(port, () => {
  console.log(`Application running on "localhost: 9090" in Development, "localhost: ${port}" in Production`);
  // console.log(`API of Meaning Cloud: ${apiKeyMeaningCloud}`);
  // console.log(`API of News API: ${apiKeyNewsAPI}`);
});

let urlAnalysis;
let keywordSearch = [];


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
  app.use(express.static('dist'));
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
  let entity, concept;
  keywordSearch = [];
  for (entity of urlAnalysis.entity_list) {
    if (entity.relevance >= 75) {
      console.log(`Searching keyword ${entity.form}`);
      let searchResult = await searchKeyword(entity.form);
      if (searchResult.totalResults > 0) {
        searchResult.keyword = entity.form;
        // fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
        keywordSearch.push(searchResult);
      }
    }
  }
  for (concept of urlAnalysis.concept_list) {
    if (concept.relevance >= 75) {
      console.log(`Searching keyword ${concept.form}`);
      let searchResult = await searchKeyword(concept.form);
      if (searchResult.totalResults > 0) {
        searchResult.keyword = concept.form;
        // fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
        keywordSearch.push(searchResult);
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
    // fs.writeFileSync('./meaningCloudAPIResponse.json', JSON.stringify(json));
    return json;
  }
  catch(error) {
    console.log("Error: \n", error);
  }
}


// ----------------------------------------------------------------------------
// Pseudo Keyword Search
// ----------------------------------------------------------------------------
// keywordSearch.push({
//   "status": "ok",
//   "totalResults": 3,
//   "articles": [{
//     "source": {
//       "id": "google-news",
//       "name": "Google News"
//     },
//     "author": null,
//     "title": "France vs. Japan | Tokyo Olympics 2020: Men's Soccer Highlights | NBC Sports - NBC Sports",
//     "description": null,
//     "url": "https://news.google.com/__i/rss/rd/articles/CBMiK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9d3B3OERHcnZHQU3SAQA?oc=5",
//     "urlToImage": null,
//     "publishedAt": "2021-07-28T20:27:58Z",
//     "content": null
//   }, {
//     "source": {
//       "id": "cbs-news",
//       "name": "CBS News"
//     },
//     "author": "Sophie Sophie",
//     "title": "Who is Jade Carey? Meet the gymnast stepping in for Simone Biles in the Olympics all-around final - CBS News",
//     "description": "On Thursday, Jade Carey will compete for gold — as a replacement for Simone Biles, who withdrew to focus on her mental health.",
//     "url": "https://www.cbsnews.com/news/jade-carey-olympics-simone-biles-gymnastics-replacement/",
//     "urlToImage": "https://cbsnews2.cbsistatic.com/hub/i/r/2021/07/28/fbdcc0f7-a32e-4a43-beec-0edc024bdce0/thumbnail/1200x630/3660492c04e698733369b4a505485930/gettyimages-1330506929.jpg",
//     "publishedAt": "2021-07-28T18:49:47Z",
//     "content": "Jade Carey finished ninth in the qualifiers for the women's all-around gymnastics competition at the Olympics, behind two of her teammates. But on Thursday, she will compete for a medal — as a replac… [+3212 chars]"
//   }, {
//     "source": {
//       "id": "nbc-news",
//       "name": "NBC News"
//     },
//     "author": "NBC Olympics",
//     "title": "Team USA men's basketball rebounds after loss to France, routs Iran - NBC News",
//     "description": "Team USA men's basketball beat Iran to earn their first preliminary victory of the Tokyo Olympics by a score of 120-66.",
//     "url": "https://www.nbcnews.com/news/olympics/team-usa-men-s-basketball-rebounds-after-loss-france-routs-n1275244",
//     "urlToImage": "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2021_30/3494594/210728-usa-iran-bball-mb-1013.JPG",
//     "publishedAt": "2021-07-28T09:51:07Z",
//     "content": "Team USA men's basketball didn't get off to the start they wanted against France, but they bounced back in a big way Wednesday against Iran to earn their first preliminary victory of the Tokyo Olympi… [+1164 chars]"
//   }]
// }
// );

// ----------------------------------------------------------------------------
// Configure Server instance
// ----------------------------------------------------------------------------
// serverMain() - Configures all HTTP request Get/Post
// ----------------------------------------------------------------------------

function serverMain() {
  // Configure App Instance
  configureApp();

  app.get('/api/getRelatedNews', async (req, res)=> {
    let searchResult = await processSearchRequest();
    console.log("Sending Related News Results");
    res.json(keywordSearch);
  });

  app.post('/api/evaluateURL', async (req, res)=>{
    console.log("POST request received.");
    urlAnalysis = await analyzeURLRequest(req.body.url);

    if (urlAnalysis.status.msg == 'OK') {
      res.send({ msg: 'POST request received. Topics extracted.' });
    } else {
      res.send({ msg: 'POST request received. Something went wrong.' });
    }
  });
}

serverMain();
