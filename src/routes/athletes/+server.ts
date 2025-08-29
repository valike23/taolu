import type { RequestHandler } from './$types';
import { AppDataSource } from '$lib/server/db';
import { Athlete } from '$lib/server/entities/athlete';

const athleteRepo = AppDataSource.getRepository(Athlete);

export const GET: RequestHandler = async () => {
  const athletes = await athleteRepo.find();
  return new Response(JSON.stringify(athletes), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const athlete = athleteRepo.create(body);
  await athleteRepo.save(athlete);
  return new Response(JSON.stringify(athlete), { status: 201 });
};
