import App from '@/App'
import { createBrowserRouter } from 'react-router-dom'
import { PlansPage } from './pages/plans'
import { PlanPage } from './pages/plan'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/plans',
		element: <PlansPage />,
	},
	{
		path: '/plans/:planId',
		element: <PlanPage />,
	},
])

export { router }
