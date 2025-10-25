const express = require('express');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 8080;

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label (optional)
register.setDefaultLabels({
  app: 'nodejs-demo-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a custom counter metric
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestCounter);

app.get('/', (req, res) => {
  res.send('Hello World!');
  httpRequestCounter.inc({ method: 'GET', route: '/', status_code: 200 });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Expose the metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
