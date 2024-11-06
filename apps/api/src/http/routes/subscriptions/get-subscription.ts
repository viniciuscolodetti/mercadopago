import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_getSubscription } from '../../../lib/mercado-pago'

export async function getSubscription(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/subscriptions/:subscriptionId',
		{
			schema: {
				tags: ['subscriptions'],
				summary: 'Get a subscription details route',
				params: z.object({
					subscriptionId: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { subscriptionId } = request.params

			try {
				const subscription = await mp_getSubscription(subscriptionId)

				if (!subscription) throw new Error('Subscription not found.')

				if (subscription.status !== 'authorized')
					throw new Error('Subscription not authorized')

				reply.status(200).send({ status: subscription.status })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao listar plano', error })
			}
		}
	)
}
