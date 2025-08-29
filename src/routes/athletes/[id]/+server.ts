import type { RequestHandler } from './$types';
import { AppDataSource } from '$lib/server/db';
import { Athlete } from '$lib/server/entities/athlete';

const athleteRepo = AppDataSource.getRepository(Athlete);

export const DELETE: RequestHandler = async ({ params }) => {
  const athlete = await athleteRepo.findOneBy({ id: Number(params.id) });
  if (!athlete) return new Response("Not Found", { status: 404 });

  await athleteRepo.remove(athlete);
  return new Response(null, { status: 204 });
};
