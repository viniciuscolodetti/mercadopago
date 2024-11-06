import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react'
import type {
	ICardPaymentBrickPayer,
	ICardPaymentFormData,
} from '@mercadopago/sdk-react/bricks/cardPayment/type'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Plan } from './plans'
import { Button } from '@/components/ui/button'
import type { IBrickError } from '@mercadopago/sdk-react/bricks/util/types/common'

type PlanParams = {
	planId: string
}

initMercadoPago('APP_USR-c74f2f46-7652-4190-9218-3199b9391136', {
	locale: 'pt-BR',
})

export function PlanPage() {
	const { planId } = useParams<PlanParams>()

	const [plan, setPlan] = useState<Plan>({} as Plan)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		window.cardPaymentBrickController?.unmount()
	}, [])

	useEffect(() => {
		async function fetchData() {
			const response: Plan = await fetch(
				`${import.meta.env.VITE_API_URL}/plans/${planId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			).then(response => response.json())

			setPlan(response)
			setIsLoading(false)
		}

		fetchData()
	}, [planId])

	const handleCancel = () => {
		window.cardPaymentBrickController?.unmount()
		navigate('/plans')
	}

	const handleGoHome = () => {
		window.cardPaymentBrickController?.unmount()
		navigate('/')
	}

	const initialization = {
		amount: plan.transaction_amount,
	}

	const customization = {
		paymentMethods: {
			minInstallments: 1,
			maxInstallments: plan.frequency,
		},
	}

	const onSubmit = async (
		formData: ICardPaymentFormData<ICardPaymentBrickPayer>
	) => {
		try {
			if (!formData.token) return
			await fetch(`${import.meta.env.VITE_API_URL}/subscriptions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					planId,
					cardTokenId: formData.token,
					emailClient: formData.payer.email,
				}),
			})

			handleGoHome()
		} catch (err) {
			console.log(err)
		}
	}

	const onError = async (error: IBrickError) => {
		// callback chamado para todos os casos de erro do Brick
		console.log(error)
	}

	if (isLoading) {
		return <div className="p-4">Carregando..</div>
	}

	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Assinar {plan.reason}</h1>

			<Button onClick={handleCancel}>Cancelar</Button>

			<p>{`${plan.transaction_amount.toLocaleString('pt-br', {
				style: 'currency',
				currency: 'BRL',
			})} each ${plan.frequency} ${plan.frequency_type}`}</p>

			<div className="max-w-lg">
				<CardPayment
					key={plan.id}
					initialization={initialization}
					customization={customization}
					onSubmit={onSubmit}
					onError={onError}
				/>
			</div>
		</div>
	)
}
