import { serverPort } from '../env'
import { app } from './app'

const port = serverPort
const host = '0.0.0.0'

app
	.listen({
		port,
		host,
	})
	.then(() => {
		console.log(`🚀 HTTP server running on http://${host}:${port}`)
	})
