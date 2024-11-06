import { useEffect, useState } from 'react'

export function VerifySubscription() {
	const [status, setStatus] = useState('pending')
	const params = new URLSearchParams(location.search)
	const subscriptionId = params.get('preapproval_id')

	useEffect(() => {
		async function fetchData() {
			const response = await fetch(
				`http://localhost:3333/subscriptions/${subscriptionId}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			).then(response => response.json())

			setStatus(response.status)
		}

		if (subscriptionId) fetchData()
	}, [subscriptionId])

	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Verificando assinatura</h1>

			<div className="flex space-x-2">
				<p>Status atual:</p> <p className="font-semibold">{status}</p>
			</div>
		</div>
	)
}
