import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '.env') })

const { default: app } = await import('./app.js')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`AuraLab Backend running on port ${PORT}`)
})