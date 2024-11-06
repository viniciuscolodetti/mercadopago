import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export function CheckoutButton() {
	const [isScriptLoaded, setIsScriptLoaded] = useState(false)

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js'
		script.async = true

		script.onload = () => {
			setIsScriptLoaded(true) // Define o estado como true quando o script é carregado
		}

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	useEffect(() => {
		if (isScriptLoaded && window.checkoutElements) {
			const elements = window.checkoutElements.init('overlayCheckout', {
				offer: 'zgtvt8mm', // Substitua pelo ID da sua oferta
			})
			elements.attach('#payment_button')
		}
	}, [isScriptLoaded])

	return (
		<Button
			variant="outline"
			type="button"
			id="payment_button"
			disabled={!isScriptLoaded}
		>
			{isScriptLoaded ? 'Proceed to checkout with hotmart' : 'Loading...'}
		</Button>
	)
}
