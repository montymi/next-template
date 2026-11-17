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
	await expect(page.locator('.accordion')).toHaveAttribute('open', '')
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
test('production offers customization and rejects project file writes', async ({
	page,
	request,
}) => {
	await page.goto('/')
	await expect(page.getByRole('button', { name: /Customize UI/ })).toBeVisible()
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

test('public starter kit carries identity, artwork, resume, and tokens into a fork', async ({
	page,
}) => {
	const { readFile, mkdtemp, rm } = await import('node:fs/promises')
	const { tmpdir } = await import('node:os')
	const path = await import('node:path')
	const { unzipSync, strFromU8 } = await import('fflate')
	const { applyKit } = await import('../scripts/apply-starter.mjs')
	await page.goto('/')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await page
		.getByRole('textbox', { name: 'Site name', exact: true })
		.fill('Alex Rivera')
	await page
		.getByLabel('Logo image', { exact: true })
		.setInputFiles('public/pwa-192x192.png')
	await expect(
		page.getByRole('status').filter({ hasText: 'Artwork ready.' }),
	).toBeVisible()
	await page
		.getByLabel('Avatar image', { exact: true })
		.setInputFiles('public/apple-touch-icon.png')
	await expect(page.locator('.brand-avatar')).toBeVisible()
	await page
		.getByRole('textbox', { name: 'Resume text', exact: true })
		.fill('Alex Rivera — designer. Built accessible websites.')
	await page.getByText('Downloads & deployment tools', { exact: true }).click()
	await page
		.getByRole('textbox', { name: 'Your fork URL', exact: true })
		.fill('https://github.com/alex/portfolio')
	await expect(
		page.getByRole('link', { name: /Deploy your fork/ }),
	).toHaveAttribute('href', 'https://vercel.com/new')
	await page.getByText('Import or export', { exact: true }).click()
	const downloadEvent = page.waitForEvent('download')
	await page
		.getByRole('button', { name: 'Download starter kit', exact: true })
		.click()
	const download = await downloadEvent
	expect(download.suggestedFilename()).toBe('coast-starter.zip')
	const files = unzipSync(
		new Uint8Array(await readFile((await download.path())!)),
	)
	expect(JSON.parse(strFromU8(files['src/config/site.json'])).name).toBe(
		'Alex Rivera',
	)
	expect(strFromU8(files['PERSONALIZE.md'])).toContain(
		'Built accessible websites.',
	)
	const root = await mkdtemp(path.join(tmpdir(), 'coast-import-'))
	try {
		await applyKit((await download.path())!, root)
		expect(
			JSON.parse(
				await readFile(path.join(root, 'src/config/brand.json'), 'utf8'),
			),
		).toEqual({ logo: '/brand/logo.png', avatar: '/brand/avatar.png' })
		expect(
			(await readFile(path.join(root, 'public/brand/logo.png')))
				.subarray(0, 8)
				.toString('hex'),
		).toBe('89504e470d0a1a0a')
		const { execFileSync } = await import('node:child_process')
		execFileSync(
			process.execPath,
			[path.resolve('scripts/generate-icons.mjs')],
			{
				cwd: root,
				env: { ...process.env, XDG_CACHE_HOME: '/tmp/coast-font-cache' },
				stdio: 'pipe',
			},
		)
		expect(
			await readFile(path.join(root, 'public/favicon.svg'), 'utf8'),
		).toContain('data:image/png;base64,')
		expect(
			(await readFile(path.join(root, 'public/social-card.png'))).length,
		).toBeGreaterThan(100)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test.describe('Configured GitHub handoff', () => {
	test.use({ serviceWorkers: 'block' })
	test('saved configuration survives GitHub sign-in and is the exact version forked', async ({
		page,
	}) => {
		let connected = false
		await page.route('**/api/github/status', (route) =>
			route.fulfill({
				json: { configured: true, connected, login: connected ? 'alex' : null },
			}),
		)
		await page.route('**/api/github/authorize?**', async (route) => {
			connected = true
			await route.fulfill({
				status: 302,
				headers: { location: '/?github=connected' },
				body: '',
			})
		})
		let submitted: Record<string, unknown> | undefined
		let releaseFork: (() => void) | undefined
		await page.route('**/api/github/fork', async (route) => {
			submitted = route.request().postDataJSON()
			await new Promise<void>((resolve) => {
				releaseFork = resolve
			})
			return route.fulfill({
				json: {
					repository: 'https://github.com/alex/personal-site',
					commit: 'https://github.com/alex/personal-site/commit/abc',
					deploy: 'https://vercel.com/new',
				},
			})
		})
		await page.goto('/')
		await expect(page.locator('a[href$="/fork"]')).toHaveCount(0)
		await page
			.locator('.hero-actions')
			.getByRole('button', { name: 'Make it yours' })
			.click()
		await page
			.getByRole('textbox', { name: 'Site name', exact: true })
			.fill('Alex’s saved site')
		await page
			.getByLabel('Logo image', { exact: true })
			.setInputFiles('public/pwa-192x192.png')
		await expect(page.locator('.brand-upload')).toBeVisible()
		await page.getByLabel('Primary hex', { exact: true }).fill('#205A79')
		await page
			.getByRole('textbox', { name: 'Resume text', exact: true })
			.fill('Private resume should never reach GitHub.')
		await page
			.getByRole('button', { name: 'Continue with GitHub', exact: true })
			.click()
		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(
			page.getByRole('textbox', { name: 'Site name', exact: true }),
		).toHaveValue('Alex’s saved site')
		await expect(page.getByLabel('Primary hex', { exact: true })).toHaveValue(
			'#205A79',
		)
		await expect(page.locator('.brand-upload')).toBeVisible()
		await page.getByLabel('Primary hex', { exact: true }).fill('#224466')
		await expect(
			page.getByRole('button', { name: 'Create my fork', exact: true }),
		).toBeEnabled()
		await page.getByText('Repository options', { exact: true }).click()
		await page
			.getByRole('textbox', { name: 'Repository name', exact: true })
			.fill('personal-site')
		await page
			.getByRole('button', { name: 'Create my fork', exact: true })
			.click()
		await expect(page.getByLabel('Primary hex', { exact: true })).toBeDisabled()
		await expect.poll(() => typeof releaseFork).toBe('function')
		releaseFork!()
		await expect(
			page.getByRole('link', { name: 'Open my repository', exact: true }),
		).toHaveAttribute('href', 'https://github.com/alex/personal-site')
		await expect(
			page.getByRole('link', { name: 'Deploy on Vercel ↗' }),
		).toHaveAttribute('href', 'https://vercel.com/new')
		await expect(
			page.getByText(
				'In Vercel, choose Import Git Repository and select alex/personal-site.',
				{ exact: true },
			),
		).toBeVisible()
		const snapshot = submitted?.snapshot as {
			tokens: { light: { primary: string } }
			brand: { name: string; logo: string }
		}
		expect(snapshot.tokens.light.primary).toBe('#224466')
		expect(snapshot.brand.name).toBe('Alex’s saved site')
		expect(snapshot.brand.logo).toMatch(/^data:image\/png;base64,/)
		expect(JSON.stringify(submitted)).not.toContain('Private resume')
		expect(submitted).not.toHaveProperty('resume')
	})
})
test('missing GitHub app is explicit and never silently forks the original', async ({
	page,
	request,
}) => {
	await page.goto('/')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await expect(
		page.getByText('GitHub sign-in isn’t enabled on this site yet.', {
			exact: false,
		}),
	).toBeVisible()
	await expect(
		page.getByRole('button', { name: 'Create my fork' }),
	).toHaveCount(0)
	expect((await request.get('/api/github/authorize')).status()).toBe(503)
	expect(
		(await request.get('/api/github/callback?code=fake&state=fake')).status(),
	).toBe(503)
	expect(
		(
			await request.post('/api/github/fork', {
				headers: { Origin: 'https://evil.test' },
				data: {},
			})
		).status(),
	).toBe(403)
	expect(
		(
			await request.post('/api/github/fork', {
				headers: { Origin: 'http://localhost:3200' },
				data: {},
			})
		).status(),
	).toBe(503)
})

test('artwork controls preview, preserve on error, remove cleanly, and accept the same file again', async ({
	page,
}) => {
	const { readFile } = await import('node:fs/promises')
	const image = {
		name: 'Montanaro Archway by the Adriatic with a very long image filename.png',
		mimeType: 'image/png',
		buffer: await readFile('public/pwa-192x192.png'),
	}
	await page.goto('/')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await expect(
		page.getByRole('button', { name: 'Remove logo', exact: true }),
	).toHaveCount(0)
	const chooserEvent = page.waitForEvent('filechooser')
	await page
		.getByRole('button', { name: 'Choose logo image', exact: true })
		.click()
	await (await chooserEvent).setFiles(image)
	await expect(
		page.getByRole('img', { name: 'Logo preview', exact: true }),
	).toBeVisible()
	await expect(page.locator('.artwork-filename').first()).toHaveText(image.name)
	const original = await page
		.getByRole('img', { name: 'Logo preview', exact: true })
		.getAttribute('src')
	await page.getByLabel('Logo image', { exact: true }).setInputFiles({
		name: 'notes.txt',
		mimeType: 'text/plain',
		buffer: Buffer.from('This is not an image'),
	})
	await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
		'PNG, JPEG, or WebP',
	)
	await expect(
		page.getByRole('img', { name: 'Logo preview', exact: true }),
	).toHaveAttribute('src', original!)
	let unexpectedPicker = false
	page.on('filechooser', () => {
		unexpectedPicker = true
	})
	await page.getByRole('button', { name: 'Remove logo', exact: true }).click()
	await expect(
		page.getByRole('img', { name: 'Logo preview', exact: true }),
	).toHaveCount(0)
	await expect(page.getByRole('dialog').getByRole('alert')).toHaveCount(0)
	expect(unexpectedPicker).toBe(false)
	await page.getByLabel('Logo image', { exact: true }).setInputFiles(image)
	await expect(
		page.getByRole('img', { name: 'Logo preview', exact: true }),
	).toBeVisible()
	await page.getByLabel('Avatar image', { exact: true }).setInputFiles(image)
	await expect(
		page.getByRole('img', { name: 'Avatar preview', exact: true }),
	).toBeVisible()
	expect(
		await page
			.locator('.artwork-control')
			.first()
			.evaluate((element) => element.scrollWidth <= element.clientWidth),
	).toBe(true)
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true)
	await page
		.getByRole('button', { name: 'Close configurator', exact: true })
		.click()
	await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('palette presets and JSON import preserve identity and round-trip exported settings', async ({
	page,
}) => {
	const { readFile } = await import('node:fs/promises')
	await page.goto('/')
	await page.getByRole('button', { name: /Customize UI/ }).click()
	await page
		.getByRole('textbox', { name: 'Site name', exact: true })
		.fill('My coastal project')
	await page.getByLabel('Corner radius', { exact: true }).fill('20')
	await page
		.getByRole('combobox', { name: 'Display font', exact: true })
		.selectOption("Georgia, 'Times New Roman', serif")
	await page
		.getByRole('button', { name: 'Apply Sage & Linen palette', exact: true })
		.click()
	await expect(page.locator('html')).toHaveCSS('--primary', '#315e49')
	await expect(page.locator('html')).toHaveCSS('--radius-medium', '20px')
	await expect(
		page.getByRole('textbox', { name: 'Site name', exact: true }),
	).toHaveValue('My coastal project')
	await expect(
		page.getByRole('combobox', { name: 'Display font', exact: true }),
	).toHaveValue("Georgia, 'Times New Roman', serif")
	await page.getByText('Import or export', { exact: true }).click()
	const downloading = page.waitForEvent('download')
	await page.getByRole('button', { name: 'Download JSON', exact: true }).click()
	const file = await downloading
	const json = await readFile((await file.path())!, 'utf8')
	const exported = JSON.parse(json)
	expect(exported.name).toBe('Sage & Linen')
	expect(exported.dark.primary).toBe('#A5D6B4')
	await page
		.getByRole('button', { name: 'Apply Clay & Ink palette', exact: true })
		.click()
	await expect(page.locator('html')).toHaveCSS('--primary', '#8e493b')
	await page
		.getByLabel('Import design tokens', { exact: true })
		.setInputFiles({
			name: 'saved-tokens.json',
			mimeType: 'application/json',
			buffer: Buffer.from(json),
		})
	await expect(page.locator('html')).toHaveCSS('--primary', '#315e49')
	await expect(
		page.getByRole('status').filter({ hasText: 'Design tokens imported.' }),
	).toBeVisible()
	await page
		.getByLabel('Import design tokens', { exact: true })
		.setInputFiles({
			name: 'invalid.json',
			mimeType: 'application/json',
			buffer: Buffer.from('{"light":{"primary":"bad"}}'),
		})
	await expect(
		page
			.getByRole('status')
			.filter({ hasText: 'Could not import design tokens.' }),
	).toBeVisible()
	await expect(page.locator('html')).toHaveCSS('--primary', '#315e49')
	await page.getByRole('button', { name: 'Dark', exact: true }).click()
	await expect(page.locator('html')).toHaveCSS('--primary', '#a5d6b4')
	await page.getByText('Why GitHub?', { exact: true }).click()
	await expect(
		page.getByText(
			'It requests public-repository access, without requesting private-repository scope.',
			{ exact: false },
		),
	).toBeVisible()
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true)
})
