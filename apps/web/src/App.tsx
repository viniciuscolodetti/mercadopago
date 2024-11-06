import { Link } from 'react-router-dom'
import { Button } from './components/ui/button'
import { CheckoutButton } from './components/hotmart-checkout-button'

function App() {
	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Dashboard</h1>

			<div className="space-x-2">
				<Link to="/plans">
					<Button>Planos</Button>
				</Link>

				<CheckoutButton />
			</div>
		</div>
	)
}

export default App
