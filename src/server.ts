import 'dotenv/config';
import { buildApp } from '@/app';

async function start() {
  const app = buildApp();

  const port = Number(process.env.PORT) || 3333;
  const host = '0.0.0.0';

  try {
    await app.listen({ port, host });
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Docs at http://localhost:${port}/reference`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
