import { defineConfig, loadEnv } from 'vite';
import type { Plugin, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage } from 'node:http';

// Runs api/chat.ts inside `npm run dev`, so the cloud assistant works locally
// without the Vercel CLI. On Vercel the same file runs as a Vercel Function.
function localApi(): Plugin {
  const readBody = (req: IncomingMessage) =>
    new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

  return {
    name: 'local-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/chat.ts');
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end();
            return;
          }
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
          const request = new Request('http://localhost/api/chat', { method: 'POST', headers, body: await readBody(req) });
          const response: Response = await mod.POST(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          if (response.body) {
            const reader = response.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (err) {
          server.config.logger.error(String(err));
          res.statusCode = 500;
          res.end('Local API error');
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make GEMINI_API_KEY from .env.local visible to the local API.
  const env = loadEnv(mode, process.cwd(), '');
  for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
    if (env[name] && !process.env[name]) process.env[name] = env[name];
  }
  return { plugins: [react(), localApi()] };
});
