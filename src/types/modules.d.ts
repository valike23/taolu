// src/types/modules.d.ts
declare module './build/handler.js' {
  import type { RequestHandler } from '@sveltejs/kit';
  export const handler: RequestHandler;
}
