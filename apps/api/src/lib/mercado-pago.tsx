import { MercadoPagoConfig, PreApprovalPlan, PreApproval } from 'mercadopago'

// Configuração das credenciais
const client = new MercadoPagoConfig({
	accessToken:
		'APP_USR-1863376364359728-110510-d4a385963dbe1f8014592bbc8bebabea-2076967451',
	options: { timeout: 5000, idempotencyKey: 'abc' },
})

const preApprovalPlan = new PreApprovalPlan(client)
const preApproval = new PreApproval(client)

// Criação de um Plano de Assinatura
const mp_createPlan = async (
	name: string,
	amount: number,
	frequency: number
) => {
	try {
		const planResponse = await preApprovalPlan.create({
			body: {
				reason: name,
				auto_recurring: {
					frequency,
					frequency_type: 'months',
					transaction_amount: amount,
					currency_id: 'BRL',
				},
				back_url: 'https://fivehundred-api.bramagran.com.br',
			},
		})
		return planResponse.id // ID do plano para uso nas assinaturas
	} catch (error) {
		console.error('Erro ao criar plano:', error)
		throw error
	}
}

// Listar Planos
const mp_searchPlans = async () => {
	const plans = await preApprovalPlan.search()

	return plans
}

const mp_getPlan = async (planId: string) => {
	const plan = await preApprovalPlan.get({ preApprovalPlanId: planId })

	return plan
}

// Criação da Assinatura
const mp_createSubscription = async (
	planId: string,
	cardTokenId: string,
	emailClient: string
) => {
	try {
		const subscriptionResponse = await preApproval.create({
			body: {
				preapproval_plan_id: planId,
				card_token_id: cardTokenId,
				payer_email: emailClient,
				status: 'authorized',
				auto_recurring: {
					frequency: 1,
					frequency_type: 'months',
					transaction_amount: 60,
					currency_id: 'BRL',
				},
			},
		})
		return subscriptionResponse.id
	} catch (error) {
		console.error('Erro ao criar assinatura:', error)
		throw error
	}
}

export { mp_createPlan, mp_createSubscription, mp_searchPlans, mp_getPlan }