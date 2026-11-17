import { test, expect } from '@playwright/test'
const locales = [
	{ locale: 'en', path: '/', title: 'Space for', language: 'Language' },
	{ locale: 'es', path: '/es', title: 'Espacio para', language: 'Idioma' },
	{ locale: 'it', path: '/it', title: 'Spazio per', language: 'Lingua' },
]
for (const { locale, path, title, language } of locales)
	test(`${locale}: localized page, navigation, and layout`, async ({
		page,
		isMobile,
	}) => {
		const errors: string[] = []
		page.on('pageerror', (error) => errors.push(error.message))
		await page.goto(path)
		await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
		await expect(page.locator('html')).toHaveAttribute('lang', locale)
		await expect(
			page.getByRole('combobox', { name: language, exact: true }),
		).toHaveValue(locale)
		await page.evaluate(() => document.fonts.ready)
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true)
		if (isMobile) await page.locator('.menu-toggle').click()
		await page.locator('.main-nav a').nth(1).click()
		await expect(page).toHaveURL(
			new RegExp(`${locale === 'en' ? '' : `/${locale}`}/design-system$`),
		)
		await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveCount(
			1,
		)
		if (isMobile)
			await expect(page.locator('.menu-toggle')).toHaveAttribute(
				'aria-expanded',
				'false',
			)
		expect(errors).toEqual([])
	})
test('language and theme preferences persist', async ({ page }) => {
	await page.goto('/')
	await page
		.getByRole('combobox', { name: 'Language', exact: true })
		.selectOption('es')
	await expect(page).toHaveURL(/\/es$/)
	await expect(page.locator('html')).toHaveAttribute('lang', 'es')
	await page.getByRole('button', { name: 'Cambiar al tema oscuro' }).click()
	await expect(page.locator('html')).toHaveClass(/dark/)
	await page.reload()
	await expect(page.locator('html')).toHaveClass(/dark/)
	await page.goto('/')
	await expect(page).toHaveURL(/\/es$/)
	await page
		.getByRole('combobox', { name: 'Idioma', exact: true })
		.selectOption('en')
	await expect(page).toHaveURL(/localhost:3200\/$/)
	await expect(page.getByRole('heading', { level: 1 })).toContainText(
		'Space for',
	)
})
test('component examples have working buttons, dialog, and local form', async ({
	page,
}) => {
	await page.goto('/design-system')
	await page.getByRole('button', { name: 'Show notification' }).click()
	await expect(
		page.getByRole('status').filter({ hasText: 'A small detail' }),
	).toBeVisible()
	await page.getByRole('button', { name: 'Open dialog', exact: true }).click()
	await expect(page.getByRole('dialog')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).not.toBeVisible()
	await page.getByText('Can I make this my own?', { exact: true }).click()
	await expect(page.locator('details')).toHaveAttribute('open', '')
	await page.getByRole('button', { name: 'Save example' }).click()
	expect(
		await page
			.getByLabel('Email address')
			.evaluate((element: HTMLInputElement) => element.validity.valid),
	).toBe(false)
	await page.getByLabel('Email address').fill('design@example.test')
	await page.getByRole('button', { name: 'Save example' }).click()
	await expect(
		page.getByRole('status').filter({ hasText: 'saved' }),
	).toBeVisible()
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true)
})
test('palette copies the actual token value', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write'])
	await page.goto('/design-system')
	await page.getByRole('button', { name: 'Copy #3D46A5', exact: true }).click()
	await expect(
		page.getByRole('status').filter({ hasText: 'Copied: #3D46A5' }),
	).toBeVisible()
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		'#3D46A5',
	)
})
test('guide, branded 404, icons, and localized manifest are usable', async ({
	page,
	request,
}) => {
	await page.goto('/getting-started')
	await expect(page.locator('pre').first()).toContainText('npm ci')
	const response = await page.goto('/it/missing-page')
	expect(response?.status()).toBe(404)
	await expect(page.locator('html')).toHaveAttribute('lang', 'it')
	await expect(page.locator('.not-found h1')).toBeVisible()
	const manifest = await (await request.get('/manifests/es.webmanifest')).json()
	expect(manifest).toMatchObject({
		name: 'Coast',
		lang: 'es',
		start_url: '/es',
	})
	for (const file of [
		'/favicon.ico',
		'/favicon.svg',
		'/apple-touch-icon.png',
		'/pwa-maskable-512x512.png',
		'/social-card.png',
	])
		expect((await request.get(file)).status()).toBe(200)
})
test('production has no editor and rejects token reads and writes', async ({
	page,
	request,
}) => {
	await page.goto('/')
	await expect(page.getByRole('button', { name: /Customize UI/ })).toHaveCount(
		0,
	)
	expect((await request.get('/api/dev/tokens')).status()).toBe(404)
	expect(
		(
			await request.post('/api/dev/tokens', {
				data: {},
				headers: { Origin: 'http://localhost:3200' },
			})
		).status(),
	).toBe(404)
})
test('visited public page works offline after worker control', async ({
	page,
	context,
}) => {
	await page.goto('/')
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready
		if (!navigator.serviceWorker.controller)
			await new Promise<void>((resolve) =>
				navigator.serviceWorker.addEventListener(
					'controllerchange',
					() => resolve(),
					{ once: true },
				),
			)
	})
	await page.reload()
	await expect(page.getByRole('heading', { level: 1 })).toContainText(
		'Space for',
	)
	await context.setOffline(true)
	await page.reload()
	await expect(page.getByRole('heading', { level: 1 })).toContainText(
		'Space for',
	)
	await context.setOffline(false)
})
