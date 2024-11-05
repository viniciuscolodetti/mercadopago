import { Link } from 'react-router-dom'
import { Button } from './components/ui/button'

function App() {
	return (
		<div className="p-4 space-y-4">
			<h1 className="text-3xl font-semibold">Dashboard</h1>

			<div>
				<Link to="/plans">
					<Button>Planos</Button>
				</Link>
			</div>
		</div>
	)
}

export default App
