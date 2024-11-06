import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { appRoutes } from './routes'
import { jwtSecret } from '../env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'mercado pago',
			description: 'API integração mercado pago',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'JWT obtained from authentication route.',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
	routePrefix: '/docs',
})

app.register(fastifyJwt, {
	secret: jwtSecret,
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors)

app.register(appRoutes)

export { app }
