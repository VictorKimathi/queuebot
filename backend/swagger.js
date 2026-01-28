const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './src/app.js',
  './src/routes/customerRoutes.js',
  './src/routes/ticketRoutes.js',
  './src/routes/staffRoutes.js',
  './src/routes/adminRoutes.js',
];

const doc = {
  info: {
    title: 'QueueBot API',
    description: 'Auto-generated OpenAPI docs from Express routes.',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4000}`,
      description: 'Local dev',
    },
  ],
};

function generateSwagger() {
  return swaggerAutogen(outputFile, endpointsFiles, doc);
}

if (require.main === module) {
  generateSwagger()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(`Swagger generated at ${outputFile}`);
      process.exit(0);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Swagger generation failed:', err);
      process.exit(1);
    });
}

module.exports = { generateSwagger, outputFile };

