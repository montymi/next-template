import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const localeDir = path.join(__dirname, '..', 'public', 'locales')
const targetFile = path.join(__dirname, '..', 'src', 'locales.json')

const generateLocaleMap = () => {
	const folders = fs.readdirSync(localeDir).filter((item) => {
		const itemPath = path.join(localeDir, item)
		return fs.statSync(itemPath).isDirectory()
	})
	fs.writeFileSync(targetFile, JSON.stringify(folders, null, 2))
}

generateLocaleMap()
