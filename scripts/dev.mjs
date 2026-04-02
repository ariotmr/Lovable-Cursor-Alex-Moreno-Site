/**
 * Unified dev server launcher.
 * Starts `vercel dev` which gives you:
 *   - Frontend (React/Vite) 
 *   - Backend  (API routes in /api/)
 *   - All on port 3000
 *
 * This wrapper exists to bypass Vercel's recursion detection,
 * which blocks `"dev": "vercel dev"` in package.json.
 */
import { spawn } from "child_process";

const child = spawn("vercel", ["dev"], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
});

child.on("exit", (code) => process.exit(code ?? 0));
