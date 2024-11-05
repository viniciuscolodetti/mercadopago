import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_searchPlans } from '../../../lib/mercado-pago'

export async function searchPlans(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/plans',
		{
			schema: {
				tags: ['plans'],
				summary: 'List plans route',
				response: {
					200: z.object({
						plans: z.array(
							z.object({
								id: z.string().optional(),
								reason: z.string().optional(),
								frequency: z.number().optional(),
								frequency_type: z.string().optional(),
								transaction_amount: z.number().optional(),
							})
						),
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
				const plans = await mp_searchPlans()

				if (!plans.results) throw new Error('Plans not found.')

				const parsedPlans = plans.results
					.filter(plan => plan.status === 'active')
					.map(plan => {
						return {
							id: plan.id,
							reason: plan.reason,
							frequency: plan.auto_recurring?.frequency,
							frequency_type: plan.auto_recurring?.frequency_type,
							transaction_amount: plan.auto_recurring?.transaction_amount,
						}
					})

				reply.status(200).send({ plans: parsedPlans })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao listar planos', error })
			}
		}
	)
}
