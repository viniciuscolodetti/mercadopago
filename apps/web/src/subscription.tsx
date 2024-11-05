import { initMercadoPago } from '@mercadopago/sdk-react'
import { CardPayment } from '@mercadopago/sdk-react'
import type {
	ICardPaymentBrickPayer,
	ICardPaymentFormData,
} from '@mercadopago/sdk-react/bricks/cardPayment/type'

initMercadoPago('APP_USR-c74f2f46-7652-4190-9218-3199b9391136')

export function SubscriptionPage() {
	const handleSubmit = async (
		formData: ICardPaymentFormData<ICardPaymentBrickPayer>
	) => {
		if (!formData.token) return

		const response = await fetch('http://localhost:3333/subscriptions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				planId: '2c93808492f5938b0192f8890d550154',
				cardTokenId: formData.token,
				emailClient: formData.payer.email,
			}),
		})

		console.log(response)

		// const data = await response.json()
		// onSubscriptionCreated(data.subscriptionId)
	}

	return (
		<div>
			<h1>assinatura</h1>

			<CardPayment initialization={{ amount: 560 }} onSubmit={handleSubmit} />
		</div>
	)
}
