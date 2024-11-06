import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_verifyPayment } from '../../../lib/mercado-pago'

export async function getSubscription(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/subscriptions/:planId',
		{
			schema: {
				tags: ['subscriptions'],
				summary: 'Get a subscription details route',
				params: z.object({
					planId: z.string(),
				}),
				querystring: z.object({
					paymentId: z.coerce.number(),
				}),
			},
		},
		async (request, reply) => {
			const { planId } = request.params
			const { paymentId } = request.query

			try {
				const payment = await mp_verifyPayment(paymentId, planId)

				if (payment.status !== 'approved')
					throw new Error('Subscription not authorized')

				reply.status(200).send({ status: payment.status })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao listar plano', error })
			}
		}
	)
}
