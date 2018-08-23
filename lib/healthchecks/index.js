const { default: HealthCheck } = require('@flexdrive/fd-health-check')

const healthCheck = new HealthCheck()

async function routes(fastify, options) {
  const liveness = options.liveness || []
  const readiness = options.readiness || []

  liveness.forEach(function(check) {
    if (check) healthCheck.addLivenessCheck(check)
  })

  readiness.forEach(function(check) {
    if (check) healthCheck.addReadinessCheck(check)
  })

  fastify.get('/health', healthCheck.liveHandler)
  fastify.get('/healthz', healthCheck.readyHandler)
}

module.exports = routes
