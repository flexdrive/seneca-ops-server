const Metrics = require('fastify-metrics')

async function routes(fastify, options) {
  fastify.register(Metrics)

  fastify.route({
    url: '/metrics',
    method: 'GET',
    schema: { hide: true },
    logLevel: 'warn',
    handler: (_, reply) => {
      const data = fastify.metrics.client.register.metrics()
      reply.type('text/plain').send(data)
    }
  })

  process.on('SIGTERM', function onSigterm() {
    clearInterval(fastify.metrics.client.collectDefaultMetrics())
  })
}

module.exports = routes
