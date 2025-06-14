import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5_000 },

  use: {
    ignoreHTTPSErrors: true,

    baseURL: 'https://oraclekairo.com',

    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Video and screenshot on failure:
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    // Trace on first retry:
    trace: 'on-first-retry',

    // HAR belongs under contextOptions, not top-level use:
    contextOptions: {
      recordHar: {
        path: 'test-results/network.har',
        omitContent: false,
      },
    },
  },

  projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] , headless: false,
     launchOptions: {args: ['--disable-gpu', '--no-sandbox'],},} },
  ],
};

export default config;
