import { app } from './app'
import * as dotenv from 'dotenv'

dotenv.config({
	path:
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: '.env.development',
})

const apiPort: string | undefined = process.env.SERVER_PORT

if (!apiPort) {
	throw new Error('As variáveis de ambiente SERVER_PORT devem estar definidas.')
}

const port = Number(process.env.SERVER_PORT)
const host = '0.0.0.0'

app
	.listen({
		port,
		host,
	})
	.then(() => {
		console.log(`🚀 HTTP server running on http://${host}:${port}`)
	})
