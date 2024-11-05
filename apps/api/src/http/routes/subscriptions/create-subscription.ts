import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_createSubscription } from '../../../lib/mercado-pago'

export async function createSubscription(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/subscriptions',
		{
			schema: {
				tags: ['subscriptions'],
				summary: 'Create a new subscription route',
				body: z.object({
					planId: z.string(),
					cardTokenId: z.string(),
					emailClient: z.string().email(),
				}),
			},
		},
		async (request, reply) => {
			const { planId, cardTokenId, emailClient } = request.body

			try {
				const subscription = await mp_createSubscription(
					planId,
					cardTokenId,
					emailClient
				)

				reply.status(200).send({ subscription })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao criar assinatura', error })
			}
		}
	)
}
