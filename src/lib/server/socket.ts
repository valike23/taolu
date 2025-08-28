import { Server } from 'socket.io';
import { AppDataSource } from './db';
import { Match } from './entities/match.entity';

let io: Server;

export function initSocket(server: any) {
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('update-score', async (data) => {
      const repo = AppDataSource.getRepository(Match);
      let match = await repo.findOneBy({ id: data.id });

      if (match) {
        match.redScore = data.redScore;
        match.blueScore = data.blueScore;
        await repo.save(match);
        io.emit('score-updated', match);
      }
    });
  });
  return io;
}
