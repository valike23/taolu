import { AppDataSource } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { initSocket } from '$lib/server/socket';

AppDataSource.initialize().then(() => {
  console.log("SQLite database initialized");
});


export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  if (!(global as any).socketInitialized) {
    const server = (event.platform as any)?.server?.server; 
    if (server) {
      initSocket(server);
      (global as any).socketInitialized = true;
      console.log('✅ Socket.IO initialized');
    }
  }

  return response;
};