/**
 * Vite plugin that serves Vercel-style API routes (/api/*.ts) during local development.
 *
 * In production, Vercel automatically converts files in /api/ to serverless functions.
 * During local dev, this plugin intercepts /api/* requests and runs the handlers
 * directly inside Vite's dev server — no `vercel dev` needed.
 */
import type { Plugin, ViteDevServer } from 'vite';
import { loadEnv } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

/* ------------------------------------------------------------------ */
/*  Thin shims for VercelRequest / VercelResponse                     */
/* ------------------------------------------------------------------ */

function shimVercelRequest(req: IncomingMessage, body: unknown) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { query[k] = v; });

  return Object.assign(req, { body, query, cookies: {} });
}

function shimVercelResponse(res: ServerResponse) {
  const vRes: any = Object.assign(res, {
    status(code: number) { res.statusCode = code; return vRes; },
    json(data: unknown) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return vRes;
    },
    send(body: string | Buffer) { res.end(body); return vRes; },
    redirect(urlOrStatus: string | number, url?: string) {
      if (typeof urlOrStatus === 'number' && url) {
        res.writeHead(urlOrStatus, { Location: url });
      } else {
        res.writeHead(307, { Location: String(urlOrStatus) });
      }
      res.end();
      return vRes;
    },
  });
  return vRes;
}

/* ------------------------------------------------------------------ */
/*  Body parser helper                                                */
/* ------------------------------------------------------------------ */

function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    // GET / HEAD / DELETE normally have no body
    if (!req.method || ['GET', 'HEAD', 'DELETE'].includes(req.method)) {
      return resolve({});
    }
    let raw = '';
    req.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { resolve(raw || {}); }
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Plugin                                                            */
/* ------------------------------------------------------------------ */

export function vercelApiPlugin(): Plugin {
  let envLoaded = false;

  return {
    name: 'vite-vercel-api-dev',

    configureServer(server: ViteDevServer) {
      // Run immediately BEFORE Vite's internal middleware so we intercept GET
      // requests before Vite serves the .ts file as raw JS source.
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Only intercept /api/* paths
        if (!url.startsWith('/api/')) return next();

        // Lazily load ALL env vars (including non-VITE_ ones) into process.env
        if (!envLoaded) {
          const env = loadEnv('development', process.cwd(), '');
          for (const key of Object.keys(env)) {
            if (!(key in process.env)) process.env[key] = env[key];
          }
          envLoaded = true;
        }

        // Map URL → file:  /api/create-checkout?foo=1  →  ./api/create-checkout.ts
        const fnName = url.replace(/^\/api\//, '').split('?')[0];
        const modulePath = `/api/${fnName}.ts`;

        try {
          const body = await parseBody(req);
          const mod  = await server.ssrLoadModule(modulePath);
          const handler = mod.default;

          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: `No default handler in ${modulePath}` }));
            return;
          }

          await handler(shimVercelRequest(req, body), shimVercelResponse(res));
        } catch (err: any) {
          console.error(`[vite-api] Error handling ${url}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: err.message || 'Internal Server Error' }));
          }
        }
      });
    },
  };
}
