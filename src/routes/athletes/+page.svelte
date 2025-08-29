<script lang="ts">
  import { onMount } from "svelte";
  import type { Athlete } from "$lib/server/entities/athlete";

  let athletes: Athlete[] = [];
  let name = "";
  let category = "";

  async function loadAthletes() {
    const res = await fetch("/athletes");
    athletes = await res.json();
  }

 async function addAthlete() {
  if (!name.trim()) return;
  const res = await fetch("/athletes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category })
  });
  const newAthlete = await res.json();
  athletes = [...athletes, newAthlete];
  name = "";
  category = "";
}

async function deleteAthlete(id: number) {
  await fetch(`/athletes/${id}`, { method: "DELETE" });
  athletes = athletes.filter(a => a.id !== id);
}

  onMount(() => {
    loadAthletes();
  });
</script>

<div class="w-full h-screen bg-black text-white flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-6">Athlete Management</h1>

  <!-- Add Athlete Form -->
  <div class="card bg-gray-800 p-6 mb-6 w-full max-w-md">
    <h2 class="text-xl font-bold mb-4">Add Athlete</h2>
    <div class="form-control mb-3">
      <label class="label">
        <span class="label-text text-white">Name</span>
      </label>
      <input
        type="text"
        bind:value={name}
        placeholder="Athlete name"
        class="input input-bordered w-full text-black"
      />
    </div>
    <div class="form-control mb-3">
      <label class="label">
        <span class="label-text text-white">Category</span>
      </label>
      <input
        type="text"
        bind:value={category}
        placeholder="Category (optional)"
        class="input input-bordered w-full text-black"
      />
    </div>
    <button class="btn btn-primary w-full" on:click={addAthlete}>
      Add Athlete
    </button>
  </div>

  <!-- Athlete List -->
  <div class="w-full max-w-2xl">
    <table class="table w-full text-center">
      <thead class="bg-red-700 text-white">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody class="bg-gray-800">
        {#each athletes as athlete}
          <tr class="hover:bg-base-300">
            <td>{athlete.id}</td>
            <td class="font-semibold">{athlete.name}</td>
            <td>{athlete.category || "-"}</td>
            <td>
              <button
                class="btn btn-error btn-sm"
                on:click={() => deleteAthlete(athlete.id)}>
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
