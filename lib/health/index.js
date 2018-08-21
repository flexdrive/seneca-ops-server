
const { HealthCheck } = require('@flexdrive/fd-health-check');

async function routes(fastify, options) {
  const healthCheck = new HealthCheck(options);

  fastify.get('/health', async (request, reply) => {
    reply.send('OK')
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