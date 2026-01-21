// Monitor all requests
page.on('request', request => {
  console.log('>>', request.method(), request.url());
  console.log('Headers:', request.headers());
  console.log('Post Data:', request.postData()); // For POST requests
});

// Monitor all responses
page.on('response', async response => {
  console.log('<<', response.status(), response.url());
  console.log('Headers:', response.headers());
  
  // Get response body (be careful with large responses)
  if (response.url().includes('/api/')) {
    const body = await response.json();
    console.log('Body:', body);
  }
});

await page.goto('https://example.com');


// Wait for a specific API response
const responsePromise = page.waitForResponse('**/api/fetch_data');
await page.getByText('Update').click();
const response = await responsePromise;

// With a predicate function
const response = await page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);

test('mocks API response', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ json });
  });
  
  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Strawberry')).toBeVisible();
});

test('modifies API response', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    // Make the actual request
    const response = await route.fetch();
    const json = await response.json();
    
    // Modify the response
    json.push({ name: 'Loquat', id: 100 });
    
    // Return modified response
    await route.fulfill({ response, json });
  });
  
  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Loquat')).toBeVisible();
});

// Block images
await page.route('**/*.{png,jpg,jpeg,gif}', route => route.abort());

// Block CSS
await page.route('**/*.css', route => route.abort());

// Block specific domains
await page.route('**/analytics.google.com/**', route => route.abort());

await page.route('**/*', async route => {
  const headers = route.request().headers();
  
  // Remove a header
  delete headers['X-Secret'];
  
  // Add/modify headers
  headers['Authorization'] = 'Bearer my-token';
  headers['X-Custom-Header'] = 'custom-value';
  
  await route.continue({ headers });
});

await browserContext.route('**/api/login', route => route.fulfill({
  status: 200,
  body: JSON.stringify({ token: 'fake-token' }),
}));

# Record all traffic
npx playwright open --save-har=example.har https://example.com

# Record only API requests
npx playwright open --save-har=api.har --save-har-glob="**/api/**" https://example.com

// Method 1: Via browser context
const context = await browser.newContext({
  recordHar: {
    path: 'network.har',
    mode: 'full',  // 'full' or 'minimal'
    urlFilter: '**/api/**'  // Optional: filter requests
  }
});

// ... run your tests ...

await context.close();  // HAR file is saved on context close

test('replay from HAR', async ({ page }) => {
  // Serve responses from HAR file
  await page.routeFromHAR('./hars/fruit.har', {
    url: '*/**/api/v1/fruits',
    update: false,  // Set to true to record/update the HAR
  });
  
  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Strawberry')).toBeVisible();
});

// First run: records real responses to HAR
// Subsequent runs: uses HAR for responses
await page.routeFromHAR('./hars/api.har', {
  url: '**/api/**',
  update: true  // Records if HAR doesn't exist
});

import { chromium } from '@playwright/test';

test('network throttling', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Create CDP session
  const client = await context.newCDPSession(page);
  
  // Enable network domain
  await client.send('Network.enable');
  
  // Simulate slow 3G network
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 200,           // ms
    downloadThroughput: 50000,   // bytes/s (~400 Kbps)
    uploadThroughput: 20000,     // bytes/s (~160 Kbps)
  });
  
  await page.goto('https://example.com');
  
  await browser.close();
});


