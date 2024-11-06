// global.d.ts
export {}

declare global {
	interface Window {
		checkoutElements?: {
			init: (
				type: string,
				options: { offer: string }
			) => {
				attach: (selector: string) => void
			}
		}
		cardPaymentBrickController?: {
			unmount: () => void
		}
	}
}
