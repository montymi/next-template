import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import tokens from '../src/design-system/tokens.json' with { type: 'json' }
test('editor previews tokens, persists a draft, exports JSON, and resets', async ({
	page,
}) => {
	await page.goto('/design-system')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	const panel = page.getByRole('dialog', { name: 'Make it yours.' })
	await expect(panel).toBeVisible()
	await page.getByLabel('Primary hex', { exact: true }).fill('#205A79')
	await expect(page.locator('html')).toHaveCSS('--primary', '#205a79')
	await page
		.getByRole('combobox', { name: 'Display font', exact: true })
		.selectOption("Georgia, 'Times New Roman', serif")
	await expect(page.locator('h1')).toHaveCSS(
		'font-family',
		'Georgia, "Times New Roman", serif',
	)
	await page.getByLabel('Corner radius', { exact: true }).fill('20')
	await expect(page.locator('html')).toHaveCSS('--radius-medium', '20px')
	const download = page.waitForEvent('download')
	await page.getByRole('button', { name: 'Download JSON' }).click()
	const file = await download
	expect(file.suggestedFilename()).toBe('design-tokens.json')
	const exported = JSON.parse(await readFile((await file.path())!, 'utf8'))
	expect(exported.light.primary).toBe('#205A79')
	expect(exported.radii.medium).toBe(20)
	await page.getByRole('button', { name: 'Close configurator' }).click()
	await expect(
		page.getByRole('button', { name: 'Copy #205A79', exact: true }),
	).toBeVisible()
	await page.reload()
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await expect(page.getByLabel('Primary hex', { exact: true })).toHaveValue(
		'#205A79',
	)
	await page.getByRole('button', { name: 'Reset preview' }).click()
	await expect(page.getByLabel('Primary hex', { exact: true })).toHaveValue(
		tokens.light.primary,
	)
	await page.getByRole('button', { name: 'Dark', exact: true }).click()
	await page.getByLabel('Background hex', { exact: true }).fill('#152A36')
	await expect(page.locator('html')).toHaveCSS('--background', '#152a36')
	await page.getByRole('button', { name: 'Reset preview' }).click()
	await page.getByRole('button', { name: 'Light', exact: true }).click()
	await page.keyboard.press('Escape')
	await expect(panel).not.toBeVisible()
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true)
})
// Saving the unchanged project settings exercises the real UI and endpoint without changing the repository's palette.
test('save writes the validated project JSON and regenerates CSS', async ({
	page,
}) => {
	await page.goto('/')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await page.getByRole('button', { name: 'Reset preview' }).click()
	await page
		.getByRole('button', { name: 'Save tokens locally', exact: true })
		.click()
	await expect(
		page
			.getByRole('status')
			.filter({ hasText: 'Saved to src/design-system/tokens.json.' }),
	).toBeVisible()
	expect(
		JSON.parse(await readFile('src/design-system/tokens.json', 'utf8')),
	).toEqual(tokens)
	expect(await readFile('src/styles/tokens.css', 'utf8')).toContain(
		`--primary: ${tokens.light.primary.toLowerCase()}`,
	)
})
