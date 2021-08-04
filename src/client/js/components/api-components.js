// ----------------------------------------------------------------------------
// HTTP Get/Post request to Node Server
// ----------------------------------------------------------------------------
// postAsync(url = '', data = {}) - HTTP Post request
// getAsync(url = '') - HTTP Get request
// ----------------------------------------------------------------------------

export async function postAsync(apiURL = '/api/evaluateURL', data = {}) {
  console.log("URL: " + data);

  if(apiURL == '/api/testPost') {
    return({ msg: 'Post Test Successful' });
  }

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

export async function getAsync(apiURL = '/api/getRelatedNews') {

  if(apiURL == '/api/testGet') {
    return({ msg: 'Get Test Successful' });
  }

  const response = await fetch(apiURL);

  try {
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = {postAsync, getAsync};
