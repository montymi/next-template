import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
const executablePath =
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
	(existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined)
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	workers: 2,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://localhost:3200',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		colorScheme: 'light',
		launchOptions: { executablePath },
	},
	projects: [
		{ name: 'policy', testMatch: '**/*.policy.spec.ts' },
		{
			name: 'desktop',
			testMatch: '**/site.browser.spec.ts',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1440, height: 1000 },
			},
		},
		{
			name: 'mobile',
			testMatch: '**/site.browser.spec.ts',
			use: { ...devices['iPhone 13'], browserName: 'chromium' },
		},
		{
			name: 'dev-desktop',
			testMatch: '**/dev.browser.spec.ts',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1440, height: 1000 },
				baseURL: 'http://localhost:3201',
			},
		},
		{
			name: 'dev-mobile',
			testMatch: '**/dev.browser.spec.ts',
			use: {
				...devices['iPhone 13'],
				browserName: 'chromium',
				baseURL: 'http://localhost:3201',
			},
		},
	],
	webServer: [
		{
			command: 'npm run start -- --hostname localhost --port 3200',
			url: 'http://localhost:3200',
			reuseExistingServer: false,
			timeout: 120000,
		},
		{
			command: 'npm run dev -- --hostname localhost --port 3201',
			url: 'http://localhost:3201',
			reuseExistingServer: false,
			timeout: 120000,
		},
	],
})
