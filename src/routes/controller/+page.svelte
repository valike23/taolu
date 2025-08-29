<script lang="ts">
  import { onMount } from "svelte";
  import { io, Socket } from "socket.io-client";
  import type { Athlete } from "$lib/server/entities/athlete";

  let socket: Socket;
  let athletes: Athlete[] = [];
  let currentAthlete: Athlete | null = null;

  async function loadAthletes() {
    const res = await fetch("/athletes");
    athletes = await res.json();
  }

  function setCurrentAthlete(athlete: Athlete) {
    currentAthlete = athlete;
    socket.emit("current-athlete", athlete);
  }

  onMount(async () => {
    socket = io("http://localhost:3000");
    await loadAthletes();

    socket.on("score-updated", (updatedAthletes) => {
      athletes = updatedAthletes;
    });
  });
</script>

<div class="w-full h-screen bg-black text-white flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-6">Judges Summary Screen</h1>
  
  <!-- Athlete Selector -->
  <div class="mb-6">
    <select 
      class="select select-bordered w-full max-w-xs text-black"
      on:change={(e: any) => setCurrentAthlete(athletes[e.target.value])}>
      <option disabled selected>Select athlete</option>
      {#each athletes as athlete, i}
        <option value={i}>{athlete.name}</option>
      {/each}
    </select>

    <button class="btn btn-primary" type="button">Current Athlete</button>
  </div>

  <!-- Table -->
  <div class="overflow-x-auto w-full max-w-6xl">
    <table class="table table-zebra w-full text-center">
      <thead class="bg-red-700 text-white text-lg">
        <tr>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">J1</th>
          <th class="px-4 py-2">J2</th>
          <th class="px-4 py-2">J3</th>
          <th class="px-4 py-2">SUB-TOTAL</th>
          <th class="px-4 py-2">Deduction</th>
          <th class="px-4 py-2">TOTAL</th>
        </tr>
      </thead>
      <tbody class="bg-gray-800">
        {#each athletes as athlete}
          <tr class="hover:bg-gray-700">
            <td class="font-semibold">{athlete.name}</td>
            <td>{athlete.scores.find(s => s.judge === "j1")?.value || "-"}</td>
            <td>{athlete.scores.find(s => s.judge === "j2")?.value || "-"}</td>
            <td>{athlete.scores.find(s => s.judge === "j3")?.value || "-"}</td>
            <td class="font-bold">
              { (athlete.scores.reduce((sum, s) => sum + s.value, 0)).toFixed(1) }
            </td>
            <td>{athlete.scores[0]?.deduction || 0}</td>
            <td class="font-bold text-green-400">
              { (athlete.scores.reduce((sum, s) => sum + s.value, 0) 
                 - (athlete.scores[0]?.deduction || 0)).toFixed(1) }
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
