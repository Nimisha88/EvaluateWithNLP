// const {postAsync, getAsync} = require('../components/api-components.js');
import * as apiRequest from '../components/api-components.js'

test('Ping Node Server with Post Request', async () => {
  const response = await apiRequest.postAsync("/api/testPost", {});
  expect(response.msg).toBe('Post Test Successful');
  expect(response.msg).not.toBe('POST request received.');
});

test('Ping Node Server with Get Request', async () => {
  const response = await apiRequest.getAsync("/api/testGet");
  expect(response.msg).toBe('Get Test Successful');
  expect(response.msg).not.toBe('GET request received.');
});
