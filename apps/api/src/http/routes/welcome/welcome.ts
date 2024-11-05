import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function welcomeRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			schema: {
				tags: ['welcome'],
				summary: 'Welcome route',
				response: {
					200: z.object({
						message: z.string(),
						server: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			return reply.send({ message: 'Welcome route', server: 'API' })
		}
	)
}
