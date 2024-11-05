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
							<CardContent>
								<Link to={`/plans/${plan.id}`}>
									<Button>Assinar</Button>
								</Link>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
