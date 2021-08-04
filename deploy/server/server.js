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
  let entity;
  for (entity of urlAnalysis.entity_list) {
    if (entity.relevance >= 75) {
      console.log(`Searching keyword ${entity.form}`);
      let searchResult = await searchKeyword(entity.form);
      if (searchResult.status == 'ok') {
        searchResult.keyword = entity.form;
        fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
        keywordSearch.push(searchResult);
      }
    }
  }
  for (entity of urlAnalysis.concept_list) {
    if (entity.relevance >= 95) {
      console.log(`Searching keyword ${entity.form}`);
      let searchResult = await searchKeyword(entity.form);
      if (searchResult.status == 'ok') {
        searchResult.keyword = entity.form;
        fs.appendFileSync('./newsAPIResponse.json', JSON.stringify(searchResult));
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
    fs.writeFileSync('./meaningCloudAPIResponse.json', JSON.stringify(json));
    // console.log(JSON.stringify(json));
    return json;
  }
  catch(error) {
    console.log("Error: \n", error);
  }
}

// ----------------------------------------------------------------------------
// Create psuedo instance of keywordSearch
// ----------------------------------------------------------------------------

keywordSearch = [{
  "status": "ok",
  "totalResults": 2,
  "keyword": "BBC News",
  "articles": [{
    "source": {
      "id": "google-news-sa",
      "name": "Google News (Saudi Arabia)"
    },
    "author": "https://www.facebook.com/bbcnews",
    "title": "تصاعد التوتر بين إسرائيل وإيران بشأن هجوم على ناقلة نفط تديرها شركة إسرائيلية - BBC News عربي",
    "description": "رئيس الوزراء الإسرائيلي، نفتالي بينيت يؤكد تورط إيران بالهجوم على ناقلة النفط قبالة سواحل عمان وإيران تقول إن \"الاتهامات الإسرائيلية لا أساس لها من الصحة\".",
    "url": "https://www.bbc.com/arabic/middleeast-57991039",
    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_arabic/4E65/production/_119696002__119694239_mediaitem119694236.jpg",
    "publishedAt": "2021-08-01T18:49:50+00:00",
    "content": "EPA\r\n\" \" \" \". \r\n \" \" . \r\n : \" \" \" \". \r\n . \r\n/ .\r\n - - \" \" . \r\n . \r\n .\r\n . \r\n \" \". \r\n \" \". \r\n \" \". \r\n : \" \". \r\n . \r\n : \" \" \" \" . \r\n : \" \". \r\n . \r\n : \" \". \r\n : \" \" \" 29 / \".\r\n . \r\n 2015 . \r\n . . \r\n<ul>… [+105 chars]"
  }, {
    "source": {
      "id": "google-news-ru",
      "name": "Google News (Russia)"
    },
    "author": "https://www.facebook.com/bbcnews",
    "title": "Пожары в Турции: пять очагов пока не удается локализовать, туристов эвакуируют с пляжей - BBC News Русская служба",
    "description": "В Турции за последние дни удалось потушить более 100 лесных пожаров, но по состоянию на воскресенье пока не удается остановить распространение пяти пожаров в курортных провинциях Анталья и Мугла.",
    "url": "https://www.bbc.com/russian/news-58019755",
    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_russian/C7B9/production/_119692115_gettyimages-1234323556.jpg",
    "publishedAt": "2021-08-01T12:28:35+00:00",
    "content": "100 , . \r\n , , - , .\r\n - , , - , .\r\n , . . , .\r\nEHA News , .\r\n , , , .\r\n , , , . \r\n , - .\r\n , - . , .\r\n , .\r\n - . \r\n , . \r\n , , , .\r\n<ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li… [+14 chars]"
  }]
},
{
  "status": "ok",
  "totalResults": 7,
  "keyword": "music",
  "articles": [{
    "source": {
      "id": "ign",
      "name": "IGN"
    },
    "author": "Adam Bankhurst",
    "title": "Ariana Grande to Headline Fortnite's Rift Tour With a 'Can't Miss Musical Journey' - IGN",
    "description": "Ariana Grande will not only join Fortnite's Icon Series as a playable character, but she is also set to headline Fortnite's Rift Tour with a \"can't-miss musical journey across new realities.\"",
    "url": "https://www.ign.com/articles/ariana-grande-fortnite-rift-tour-concert",
    "urlToImage": "https://assets-prd.ignimgs.com/2021/08/02/ariana-1627870607156.png?width=1280",
    "publishedAt": "2021-08-02T02:23:12Z",
    "content": "Ariana Grande will not only join Fortnite's Icon Series as a playable character, but she is also set to headline Fortnite's Rift Tour with a \"can't-miss musical journey across new realities.\" \r\nFrom … [+2356 chars]"
  }, {
    "source": {
      "id": "entertainment-weekly",
      "name": "Entertainment Weekly"
    },
    "author": "Rachel Yang",
    "title": "Lenny Kravitz's birthday message to Jason Momoa sparks annual Lisa Bonet celebration",
    "description": "Lenny Kravitz's birthday message to Jason Momoa, who turned 42 today, sparked the internet's annual Lisa Bonet celebration. Bonet was previously married to the musician and is currently married to the 'Aquaman' star.",
    "url": "https://ew.com/celebrity/lenny-kravitz-birthday-jason-momoa-lisa-bonet-celebration/",
    "urlToImage": "https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=%5B1000%2C479%5D&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2020%2F08%2F02%2Fjason-lenny.jpg",
    "publishedAt": "2021-08-02T01:27:10Z",
    "content": "Lenny Kravitz is sending warm birthday wishes to his ex-wife Lisa Bonet's husband Jason Momoa, which means it's once again time for the internet to lose its mind over the handsome trio's strong relat… [+1916 chars]"
  }, {
    "source": {
      "id": "breitbart-news",
      "name": "Breitbart News"
    },
    "author": "Breitbart News",
    "title": "Lollapalooza Cancels DaBaby After Rapper's Stage Banter Mentions HIV, Gay Sex Acts",
    "description": "Rapper DaBaby was cut Sunday from Lollapalooza’s closing lineup following crude remarks he made last week at a Miami-area music festival.",
    "url": "https://www.breitbart.com/entertainment/2021/08/01/lollapalooza-cancels-dababy-after-rappers-stage-banter-mentions-hiv-gay-sex-acts/",
    "urlToImage": "https://media.breitbart.com/media/2021/08/GettyImages-1330939333-640x335.jpg",
    "publishedAt": "2021-08-01T20:48:25Z",
    "content": "CHICAGO (AP) Rapper DaBaby was cut Sunday from Lollapaloozas closing lineup following crude remarks he made last week at a Miami-area music festival.\r\nThe Grammy-nominated artist, whose name is Jonat… [+1096 chars]"
  }, {
    "source": {
      "id": "bbc-news",
      "name": "BBC News"
    },
    "author": "BBC News",
    "title": "DaBaby dropped by US music festival Lollapalooza",
    "description": "The Chicago festival is the latest to cut ties, after the rapper's derogatory comments about people with HIV.",
    "url": "http://www.bbc.co.uk/news/world-us-canada-58048728",
    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/B9E8/production/_119629574_b915dfc3-8d4b-4b04-b70c-7133eb3879b6.jpg",
    "publishedAt": "2021-08-01T18:22:25.4345846Z",
    "content": "image captionRapper DaBaby was due to appear at Chicago's Lollapalooza music festival\r\nUS music festival Lollapalooza has dropped rapper DaBaby from its Sunday line-up over comments he made about peo… [+2646 chars]"
  }, {
    "source": {
      "id": "the-huffington-post",
      "name": "The Huffington Post"
    },
    "author": "Cole Delbyck",
    "title": "Lollapalooza Drops DaBaby Over Homophobic Comments Hours Before His Performance",
    "description": "The music festival said it is \"founded on diversity, inclusivity, respect, and love.\"",
    "url": "https://www.huffpost.com/entry/lollapalooza-dababy-homophobic-comments_n_6106b3d0e4b0d1b96e66f8cf",
    "urlToImage": "https://img.huffingtonpost.com/asset/6106b56328000094a57038e5.jpeg?cache=bfg4e8p6de&ops=1778_1000",
    "publishedAt": "2021-08-01T16:29:07Z",
    "content": "Hours before rapper DaBaby was set to headline the Lollapalooza Music Festival on Sunday night, organizers pulled him from the events line-up over his recent homophobic statements. \r\nThe Grammy-nomin… [+3259 chars]"
  }, {
    "source": {
      "id": "msnbc",
      "name": "MSNBC"
    },
    "author": "MSNBC",
    "title": "Lollapalooza music festival cancels DaBaby performance after homophobic remarks",
    "description": "The Lollapalooza music festival in Chicago, IL drops rapper DaBaby performance after homophobic remarks",
    "url": "https://www.nbcnews.com/pop-culture/pop-culture-news/lollapalooza-music-festival-cancels-dababy-performance-after-homophobic-remarks-n1275644",
    "urlToImage": "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2021_30/3495747/210801-dababy-jm-1149.jpg",
    "publishedAt": "2021-08-01T16:27:00Z",
    "content": "The Lollapalooza music festival cancelled DaBaby's Sunday night performance in response to the rapper's recent homophobic remarks.\r\nOrganizers of the Chicago event said in a statement on Sunday morni… [+1670 chars]"
  }, {
    "source": {
      "id": "engadget",
      "name": "Engadget"
    },
    "author": "https://www.engadget.com/about/editors/james-trew",
    "title": "Mark Ronson's Apple TV+ show explores music's happy accidents | Engadget",
    "description": "Ever wondered how technology changed music? \"Watch the Sound with Mark Ronson\" reveals all..",
    "url": "https://www.engadget.com/apple-tv-watch-that-sound-with-mark-ronson-151607013.html",
    "urlToImage": "https://s.yimg.com/os/creatr-uploaded-images/2021-07/cf90c930-f167-11eb-bb2f-593fdfdb31cf",
    "publishedAt": "2021-07-30T19:07:22.3939163Z",
    "content": "If Gary Numan had heard a different sound the first time he encountered a synthesizer, we might not have had Cars, Are 'Friends' Electric? or even Gary Numan (he was born Gary Webb before adopting hi… [+5650 chars]"
  }]
},
{
  "status": "ok",
  "totalResults": 5,
  "keyword": "festival",
  "articles": [{
    "source": {
      "id": "rtl-nieuws",
      "name": "RTL Nieuws"
    },
    "author": "RTL Nieuws",
    "title": "Kabinet hakt vandaag knoop door: gaan eendaagse festivals door?",
    "description": "Het kabinet buigt zich vandaag over de toekomst van festivals. Meerdaagse festivals blijven sowieso tot 1 september verboden, maar de regering besluit of festivals zonder overnachtingen vanaf 13 augustus weer door kunnen gaan. Als ook die eendaagse festivals …",
    "url": "https://www.rtlnieuws.nl/nieuws/nederland/artikel/5245771/meerdaagse-festivals-besluit-kabinet-kort-geding-idt",
    "urlToImage": "https://www.rtlnieuws.nl/sites/default/files/styles/liggend_hoge_resolutie/public/content/images/2021/08/02/ANP-201052181.jpg?itok=ayRgheSN",
    "publishedAt": "2021-08-02T00:23:40+00:00",
    "content": "Over eendaagse festivals zei het kabinet op 13 augustus een beslissing te nemen. Festivalorganisatie ID&amp;T en ruim veertig aangesloten evenementenorganisatoren waren het daar niet mee eens en span… [+404 chars]"
  }, {
    "source": {
      "id": "breitbart-news",
      "name": "Breitbart News"
    },
    "author": "Breitbart News",
    "title": "Lollapalooza Cancels DaBaby After Rapper's Stage Banter Mentions HIV, Gay Sex Acts",
    "description": "Rapper DaBaby was cut Sunday from Lollapalooza’s closing lineup following crude remarks he made last week at a Miami-area music festival.",
    "url": "https://www.breitbart.com/entertainment/2021/08/01/lollapalooza-cancels-dababy-after-rappers-stage-banter-mentions-hiv-gay-sex-acts/",
    "urlToImage": "https://media.breitbart.com/media/2021/08/GettyImages-1330939333-640x335.jpg",
    "publishedAt": "2021-08-01T20:48:25Z",
    "content": "CHICAGO (AP) Rapper DaBaby was cut Sunday from Lollapaloozas closing lineup following crude remarks he made last week at a Miami-area music festival.\r\nThe Grammy-nominated artist, whose name is Jonat… [+1096 chars]"
  }, {
    "source": {
      "id": "bbc-news",
      "name": "BBC News"
    },
    "author": "BBC News",
    "title": "DaBaby dropped by US music festival Lollapalooza",
    "description": "The Chicago festival is the latest to cut ties, after the rapper's derogatory comments about people with HIV.",
    "url": "http://www.bbc.co.uk/news/world-us-canada-58048728",
    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/B9E8/production/_119629574_b915dfc3-8d4b-4b04-b70c-7133eb3879b6.jpg",
    "publishedAt": "2021-08-01T18:22:25.4345846Z",
    "content": "image captionRapper DaBaby was due to appear at Chicago's Lollapalooza music festival\r\nUS music festival Lollapalooza has dropped rapper DaBaby from its Sunday line-up over comments he made about peo… [+2646 chars]"
  }, {
    "source": {
      "id": "the-huffington-post",
      "name": "The Huffington Post"
    },
    "author": "Cole Delbyck",
    "title": "Lollapalooza Drops DaBaby Over Homophobic Comments Hours Before His Performance",
    "description": "The music festival said it is \"founded on diversity, inclusivity, respect, and love.\"",
    "url": "https://www.huffpost.com/entry/lollapalooza-dababy-homophobic-comments_n_6106b3d0e4b0d1b96e66f8cf",
    "urlToImage": "https://img.huffingtonpost.com/asset/6106b56328000094a57038e5.jpeg?cache=bfg4e8p6de&ops=1778_1000",
    "publishedAt": "2021-08-01T16:29:07Z",
    "content": "Hours before rapper DaBaby was set to headline the Lollapalooza Music Festival on Sunday night, organizers pulled him from the events line-up over his recent homophobic statements. \r\nThe Grammy-nomin… [+3259 chars]"
  }, {
    "source": {
      "id": "msnbc",
      "name": "MSNBC"
    },
    "author": "MSNBC",
    "title": "Lollapalooza music festival cancels DaBaby performance after homophobic remarks",
    "description": "The Lollapalooza music festival in Chicago, IL drops rapper DaBaby performance after homophobic remarks",
    "url": "https://www.nbcnews.com/pop-culture/pop-culture-news/lollapalooza-music-festival-cancels-dababy-performance-after-homophobic-remarks-n1275644",
    "urlToImage": "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2021_30/3495747/210801-dababy-jm-1149.jpg",
    "publishedAt": "2021-08-01T16:27:00Z",
    "content": "The Lollapalooza music festival cancelled DaBaby's Sunday night performance in response to the rapper's recent homophobic remarks.\r\nOrganizers of the Chicago event said in a statement on Sunday morni… [+1670 chars]"
  }]
},
{
  "status": "ok",
  "totalResults": 3,
  "keyword": "HIV",
  "articles": [{
    "source": {
      "id": "breitbart-news",
      "name": "Breitbart News"
    },
    "author": "Breitbart News",
    "title": "Lollapalooza Cancels DaBaby After Rapper's Stage Banter Mentions HIV, Gay Sex Acts",
    "description": "Rapper DaBaby was cut Sunday from Lollapalooza’s closing lineup following crude remarks he made last week at a Miami-area music festival.",
    "url": "https://www.breitbart.com/entertainment/2021/08/01/lollapalooza-cancels-dababy-after-rappers-stage-banter-mentions-hiv-gay-sex-acts/",
    "urlToImage": "https://media.breitbart.com/media/2021/08/GettyImages-1330939333-640x335.jpg",
    "publishedAt": "2021-08-01T20:48:25Z",
    "content": "CHICAGO (AP) Rapper DaBaby was cut Sunday from Lollapaloozas closing lineup following crude remarks he made last week at a Miami-area music festival.\r\nThe Grammy-nominated artist, whose name is Jonat… [+1096 chars]"
  }, {
    "source": {
      "id": "bbc-news",
      "name": "BBC News"
    },
    "author": "BBC News",
    "title": "DaBaby dropped by US music festival Lollapalooza",
    "description": "The Chicago festival is the latest to cut ties, after the rapper's derogatory comments about people with HIV.",
    "url": "http://www.bbc.co.uk/news/world-us-canada-58048728",
    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/B9E8/production/_119629574_b915dfc3-8d4b-4b04-b70c-7133eb3879b6.jpg",
    "publishedAt": "2021-08-01T18:22:25.4345846Z",
    "content": "image captionRapper DaBaby was due to appear at Chicago's Lollapalooza music festival\r\nUS music festival Lollapalooza has dropped rapper DaBaby from its Sunday line-up over comments he made about peo… [+2646 chars]"
  }, {
    "source": {
      "id": "ansa",
      "name": "ANSA.it"
    },
    "author": "ANSA.it",
    "title": "Bennett, 'Iran codardo, attacco a nave un grosso errore' - Ultima Ora",
    "description": "\"Ho appena sentito che l'Iran, in maniera codarda, sta tentando di schivare le proprie\r\nresponsabilità\" sull'attacco alla petroliera Mercer Street al largo dell'Oman. (ANSA)",
    "url": "http://www.ansa.it/sito/notizie/topnews/2021/08/01/bennett-iran-codardo-attacco-a-nave-un-grosso-errore_eec5f527-3803-473a-b264-2ee0d3d4e902.html",
    "urlToImage": "https://www.ansa.it/webimages/img_700/2021/8/1/f0e8f4d4607ffa3aecef8f55378ddc93.jpg",
    "publishedAt": "2021-08-01T13:09:00Z",
    "content": "(ANSA) - ROMA, 01 AGO - \"Ho appena sentito che l'Iran, in\r\nmaniera codarda, sta tentando di schivare le proprie\r\nresponsabilità\" sull'attacco alla petroliera Mercer Street al\r\nlargo dell'Oman. \"Quind… [+459 chars]"
  }]
}]


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
    res.json(keywordSearch);
  });

  app.post('/api/evaluateURL', async (req, res)=>{
    console.log("POST request received.");
    // urlAnalysis = await analyzeURLRequest(req.body.url);
    //
    // if (urlAnalysis.status.msg == 'OK') {
    //   let searchResult = await processSearchRequest();
    // }
    res.send({ msg: 'POST request received.' });
  });
}

serverMain();
