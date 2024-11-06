import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_createPreference } from '../../../lib/mercado-pago'

export async function createLink(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/subscriptions/link',
		{
			schema: {
				tags: ['subscriptions'],
				summary: 'Create a new link to create a subscription route',
				response: {
					200: z.object({
						url: z.string(),
					}),
					500: z.object({
						message: z.string(),
						error: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			try {
				const url = await mp_createPreference()

				if (!url) {
					return reply.status(500).send({
						message: 'Erro ao criar assinatura',
						error: 'Url não criada',
					})
				}

				reply.status(200).send({ url })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao criar assinatura', error })
			}
		}
	)
}
