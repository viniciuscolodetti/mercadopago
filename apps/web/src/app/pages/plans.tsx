import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState, type FormEvent } from 'react'
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
	const [payerEmail, setPayerEmail] = useState('')
	const [formError, setFormError] = useState(false)

	useEffect(() => {
		async function fetchData() {
			const response: Response = await fetch(
				`${import.meta.env.VITE_API_URL}/plans`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			).then(response => response.json())

			setPlans(response.plans)
		}

		fetchData()
	}, [])

	const handleCreateLink = async (event: FormEvent) => {
		event.preventDefault()

		if (!payerEmail) {
			setFormError(true)
			return
		}

		setFormError(false)

		const data = {
			payerEmail,
		}

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/subscriptions/link`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			}
		).then(response => response.json())

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

			<div className="flex space-x-4">
				{plans.map(plan => {
					return (
						<Card key={plan.id} className="w-96 justify-between flex flex-col">
							<CardHeader className="flex-1">
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

				<Card className="w-96">
					<CardHeader>
						<CardTitle>Teste por Link - Vercel</CardTitle>
						<CardDescription>
							{`
										${(500).toLocaleString('pt-br', {
											style: 'currency',
											currency: 'BRL',
										})}
										each 12 months						
										`}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleCreateLink} className="space-y-2">
							<Label htmlFor="email">E-mail</Label>
							<Input
								name="email"
								type="email"
								placeholder="test_user_XXXXXXXXX@testuser.com"
								value={payerEmail}
								onChange={input => setPayerEmail(input.currentTarget.value)}
								data-error={formError}
								className="data-[error=true]:border-rose-500"
							/>
							<Button type="submit" variant="outline">
								Assinar
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
