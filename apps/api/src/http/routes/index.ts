import type { FastifyInstance } from 'fastify'

import { welcomeRoute } from './welcome/welcome'
import { createSubscription } from './subscriptions/create-subscription'
import { createPlan } from './plans/create-plan'
import { searchPlans } from './plans/search-plans'
import { getPlan } from './plans/get-plan'

export async function appRoutes(app: FastifyInstance) {
	app.register(welcomeRoute)
	app.register(createSubscription)
	app.register(createPlan)
	app.register(searchPlans)
	app.register(getPlan)
}
