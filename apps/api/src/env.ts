import * as dotenv from 'dotenv'

dotenv.config({
	path:
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: '.env.development',
})

const requiredEnvVars = [
	'SERVER_PORT',
	'JWT_SECRET',
	'MP_BACK_URL',
	'MP_ACCESS_TOKEN',
] as const

requiredEnvVars.map(varName => {
	if (!process.env[varName]) {
		throw new Error(`A variável de ambiente ${varName} deve estar definida.`)
	}
})

const serverPort = Number(process.env.SERVER_PORT)
if (!Number(serverPort)) {
	throw new Error(
		'A variável de ambiente SERVER_PORT deve ser um número válido.'
	)
}

const jwtSecret: string = process.env.JWT_SECRET as string
const mpBackUlr: string = process.env.MP_BACK_URL as string
const mpAccessToken: string = process.env.MP_ACCESS_TOKEN as string

export { serverPort, jwtSecret, mpBackUlr, mpAccessToken }
