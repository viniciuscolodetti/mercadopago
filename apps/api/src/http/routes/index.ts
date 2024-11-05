import type { FastifyInstance } from 'fastify'

import { welcomeRoute } from './welcome/welcome'

export async function appRoutes(app: FastifyInstance) {
	app.register(welcomeRoute)
}
