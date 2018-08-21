const assert = require('assert')
const Fastify = require('fastify')
const Metrics = require('./lib/metrics')

const PLUGIN_NAME = 'ops-server'
const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 19999

function OpsServer(options) {
  const seneca = this

  const host = options.host || DEFAULT_HOST
  const port = options.port || DEFAULT_PORT
  assert(options.pinoInstance, 'Please provide pinoInstance')

  const fastify = initServer(options)

  //Register Routes
  fastify.register(Metrics)

  fastify
    .listen(port, host)
    .then(address =>
      fastify.log.info(`Seneca Ops server listening on ${address}`)
    )
    .catch(err => {
      fastify.log.error('Error Starting Seneca Ops server:', err)
    })

  process.on('SIGTERM', () => {
    fastify.close()
  })

  return PLUGIN_NAME
}

function initServer(opts) {
  const fastify = Fastify({ logger: opts.pinoInstance })
  return fastify
}

module.exports = OpsServer
