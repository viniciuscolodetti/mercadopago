import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { mp_createPlan } from '../../../lib/mercado-pago'

export async function createPlan(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/plans',
		{
			schema: {
				tags: ['plans'],
				summary: 'Create a new plan route',
				body: z.object({
					name: z.string(),
					amount: z.number(),
					frequency: z.number(),
				}),
			},
		},
		async (request, reply) => {
			const { name, amount, frequency } = request.body

			try {
				const plan = await mp_createPlan(name, amount, frequency)

				reply.status(200).send({ planId: plan })
			} catch (error) {
				reply.status(500).send({ message: 'Erro ao criar plano', error })
			}
		}
	)
}
