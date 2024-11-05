import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_getPlan } from '../../../lib/mercado-pago'

export async function getPlan(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/plans/:planId',
		{
			schema: {
				tags: ['plans'],
				summary: 'Get a plan details route',
				params: z.object({
					planId: z.string(),
				}),
				response: {
					200: z.object({
						id: z.string().optional(),
						reason: z.string().optional(),
						frequency: z.number().optional(),
						frequency_type: z.string().optional(),
						transaction_amount: z.number().optional(),
					}),
					500: z.object({
						message: z.string(),
						error: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { planId } = request.params

			try {
				const plan = await mp_getPlan(planId)

				if (!plan) throw new Error('Plans not found.')

				const parsedPlans = {
					id: plan.id,
					reason: plan.reason,
					frequency: plan.auto_recurring?.frequency,
					frequency_type: plan.auto_recurring?.frequency_type,
					transaction_amount: plan.auto_recurring?.transaction_amount,
				}

				reply.status(200).send(parsedPlans)
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao listar plano', error })
			}
		}
	)
}
