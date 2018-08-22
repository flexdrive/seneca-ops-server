
const { HealthCheck } = require('@flexdrive/fd-health-check');
const { promisify } = require('util');

async function routes(fastify, options) {
  const healthCheck = new HealthCheck(options)

  fastify.get('/health', async (request, reply) => {
    try {
      const isHealthy = !!(await fastify.senecaAct({ role: 'seneca', cmd: 'ping'}))
      if (!isHealthy) {
        return reply.code(503).send('Not Ready')
      }

      return reply.send('OK')
    } catch (error) {
      fastify.seneca.log({message: 'Liveness Check Failed'})
      return reply.code(503).send('Not Ready')
    }  
  })

  fastify.get('/healthz', async (request, reply) => {
    try {
      const isHealthy = await healthCheck.isHealthy();

      if (!isHealthy) {
        return reply.code(503).send('Not OK');
      }

      return reply.send('OK');
    } catch (e) {
      return reply.code(503).send('Not OK');
    }
  });
}

module.exports = routes