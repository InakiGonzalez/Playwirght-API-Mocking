import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: 'https://oraclekairo.com',

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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
};

export default config;
