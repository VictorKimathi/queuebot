require('dotenv').config();

const { generateSwagger } = require('./swagger');

async function main() {
  // Generate docs before boot so `/api-docs` works immediately.
  await generateSwagger();

  const { createServer } = require('./server');
  const server = createServer();

  const port = Number(process.env.PORT || 4000);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`QueueBot backend listening on :${port}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

