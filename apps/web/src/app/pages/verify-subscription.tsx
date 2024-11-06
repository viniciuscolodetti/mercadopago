import { useEffect, useState } from 'react'

export function VerifySubscription() {
	const [status, setStatus] = useState('pending')
	const params = new URLSearchParams(location.search)
	const planId = params.get('external_reference')
	const paymentId = params.get('payment_id')

	useEffect(() => {
		async function fetchData() {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/subscriptions/${planId}?paymentId=${paymentId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			).then(response => response.json())

			setStatus(response.status)
		}

		if (planId && paymentId) fetchData()
	}, [planId, paymentId])

	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Verificando assinatura</h1>

			<div className="flex space-x-2">
				<p>Status atual:</p> <p className="font-semibold">{status}</p>
			</div>
		</div>
	)
}
