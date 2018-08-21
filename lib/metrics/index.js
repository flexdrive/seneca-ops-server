const Prometheus = require('prom-client')
const defaultMetrics = Prometheus.collectDefaultMetrics()

process.on('SIGTERM', function onSigterm() {
  clearInterval(defaultMetrics)
})

async function routes(fastify, options) {
  fastify.get('/metrics', async (request, reply) => {
    reply
      .header('Content-Type', Prometheus.register.contentType)
      .send(Prometheus.register.metrics())
  })
}

module.exports = routes
