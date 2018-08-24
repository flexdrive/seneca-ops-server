const Fastify = require('fastify')
const Metrics = require('./lib/metrics')
const HealthChecks = require('./lib/healthchecks')

const PLUGIN_NAME = 'ops-server'
const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 19999

function OpsServer(options) {
  const seneca = this

  const host = options.host || DEFAULT_HOST
  const port = options.port || DEFAULT_PORT
  const logOpts = options.logOpts || false
  const signalTimeout = options.healthCheckOpts.signalTimeout || 5000

  const serverInit = { logger: logOpts }
  const fastify = Fastify(serverInit)

  //Register Routes
  fastify.register(Metrics)
  fastify.register(HealthChecks, { ...(options.healthchecks || {}) })

  fastify
    .listen(port, host)
    .then(address =>
      fastify.log.info(`Seneca Ops server listening on ${address}`)
    )
    .catch(err => {
      fastify.log.error('Error Starting Seneca Ops server:', err)
    })

  process.on('SIGTERM', () => {
    seneca.log.info(
      'SIGTERM recv.  Ops Server shutdown start: ',
      new Date().toISOString()
    )
    setTimeout(() => {
      fastify.close()
    }, signalTimeout)
  })

  return PLUGIN_NAME
}

module.exports = OpsServer
