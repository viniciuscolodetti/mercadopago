import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_createPendingSubscription } from '../../../lib/mercado-pago'

export async function createLink(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/subscriptions/link',
		{
			schema: {
				tags: ['subscriptions'],
				summary: 'Create a new link to create a subscription route',
				body: z.object({
					payerEmail: z.string().email(),
				}),
			},
		},
		async (request, reply) => {
			const { payerEmail } = request.body

			try {
				const url = await mp_createPendingSubscription(payerEmail)

				reply.status(200).send({ url })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao criar assinatura', error })
			}
		}
	)
}
