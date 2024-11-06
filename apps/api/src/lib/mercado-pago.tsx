import {
	MercadoPagoConfig,
	PreApprovalPlan,
	PreApproval,
	Preference,
	Payment,
} from 'mercadopago'
import { v4 as uuidv4 } from 'uuid'
import { mpAccessToken, mpBackUlr } from '../env'

// Configuração das credenciais
const client = new MercadoPagoConfig({
	accessToken: mpAccessToken,
	options: { timeout: 5000, idempotencyKey: 'abc' },
})

const preApprovalPlan = new PreApprovalPlan(client)
const preApproval = new PreApproval(client)
const preference = new Preference(client)
const payment = new Payment(client)

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
				back_url: `${mpBackUlr}/verify-subscription`,
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
			},
		})
		return subscriptionResponse.id
	} catch (error) {
		console.error('Erro ao criar assinatura:', error)
		throw error
	}
}

const mp_createPendingSubscription = async (payer_email: string) => {
	try {
		const subscriptionResponse = await preApproval.create({
			body: {
				payer_email,
				status: 'pending',
				back_url: `${mpBackUlr}/verify-subscription`,
				reason: 'Teste por Link - Vercel',
				auto_recurring: {
					frequency: 12,
					frequency_type: 'months',
					transaction_amount: 540,
					currency_id: 'BRL',
				},
			},
		})

		return subscriptionResponse.init_point
	} catch (error) {
		console.error('Erro ao criar assinatura pendente:', error)
		throw error
	}
}

const mp_getSubscription = async (subscriptionId: string) => {
	const subscription = await preApproval.get({ id: subscriptionId })
	return subscription
}

const subscriptions: string[] = ['8eb847d8-5732-45ac-9981-46f013b20c7e']

function formatDateToISOString(date: Date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() é 0-indexado
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	const timezoneOffset = -date.getTimezoneOffset()
	const sign = timezoneOffset >= 0 ? '+' : '-'
	const offsetHours = String(
		Math.floor(Math.abs(timezoneOffset) / 60)
	).padStart(2, '0')
	const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`
}

const mp_createPreference = async () => {
	const planId = uuidv4()
	subscriptions.push(planId)

	const expiresDate = new Date()
	expiresDate.setMinutes(expiresDate.getMinutes() + 30)

	const data = await preference.create({
		body: {
			items: [
				{
					id: 'plan01',
					title: 'Teste Plano 01',
					quantity: 1,
					unit_price: 564,
					currency_id: 'BRL',
				},
			],
			payment_methods: {
				installments: 12,
			},
			back_urls: {
				success: 'https://mercadopago-swart.vercel.app/verify-subscription',
			},
			auto_return: 'approved',
			expires: true,
			expiration_date_to: formatDateToISOString(expiresDate),
			marketplace: 'asset-design',
			external_reference: planId,
		},
	})

	console.log(data.init_point)

	return data.init_point
}

const mp_verifyPayment = async (paymentId: number, planId: string) => {
	const checkPlanExists = subscriptions.includes(planId)

	if (!checkPlanExists) {
		throw new Error('Plan does not exists')
	}

	const checkPayment = await payment.get({ id: paymentId })

	return checkPayment
}

export {
	mp_createPlan,
	mp_createSubscription,
	mp_searchPlans,
	mp_getPlan,
	mp_createPendingSubscription,
	mp_getSubscription,
	mp_createPreference,
	mp_verifyPayment,
}
