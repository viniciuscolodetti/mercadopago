import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export type Plan = {
	id: string
	reason: string
	frequency: number
	frequency_type: string
	transaction_amount: number
}

type Response = {
	plans: Plan[]
}

export function PlansPage() {
	const [plans, setPlans] = useState<Plan[]>()

	useEffect(() => {
		async function fetchData() {
			const response: Response = await fetch('http://localhost:3333/plans', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}).then(response => response.json())

			setPlans(response.plans)
		}

		fetchData()
	}, [])

	const handleCreateLink = async () => {
		const data = {
			payerEmail: 'test_user_195249839@testuser.com',
		}

		const response = await fetch('http://localhost:3333/subscriptions/link', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		}).then(response => response.json())

		const { url } = response

		if (!url) return

		window.location.href = url
	}

	if (!plans) {
		return <div className="p-4">Carregando..</div>
	}

	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Planos</h1>

			<div className="flex space-x-4 items-center">
				{plans.map(plan => {
					return (
						<Card key={plan.id} className="w-96">
							<CardHeader>
								<CardTitle>{plan.reason}</CardTitle>
								<CardDescription>
									{`
										${plan.transaction_amount.toLocaleString('pt-br', {
											style: 'currency',
											currency: 'BRL',
										})}
										each ${plan.frequency}
										${plan.frequency_type}										
										`}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-x-2">
								<Link to={`/plans/${plan.id}`}>
									<Button>Assinar</Button>
								</Link>

								<Button onClick={handleCreateLink} variant="outline">
									Link
								</Button>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
