<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { onMount } from "svelte";

  export let judgeName = "J1"; // default fallback

  let socket: Socket;
  let host = "";
  let currentAthlete: { id: number; name: string } | null = null;
  let score: number = 7.0; // single score input

  async function connectSocket() {
    try {
      console.log("testing host", host);
      const res = await fetch(`http://${host}:3000/ip`);
      const data = await res.json();
      const serverIp = data.ip || "localhost";

      socket = io(`http://${serverIp}:3000`);
      console.log("🔗 Connected to server:", serverIp);

      // listen for current athlete
      socket.on("current-athlete", (athlete) => {
        currentAthlete = athlete;
        console.log("📢 Current athlete set:", athlete);
      });

    } catch (err) {
      console.error("⚠️ Could not fetch server IP, falling back to localhost", err);
      socket = io("http://localhost:3000");
    }
  }

  onMount(async () => {
    host = location.host.split(":")[0];
    await connectSocket();

    // Get judge name from query param (?name=j1)
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      judgeName = name.toUpperCase();
    }
  });

  function submitScore() {
    if (!socket || !currentAthlete) return;
    socket.emit("judge-score", {
      judge: judgeName.toLowerCase(),
      athleteId: currentAthlete.id,
      value: score
    });
    console.log("✅ Score submitted:", { athlete: currentAthlete, score });
  }
</script>

<!-- Judge Screen -->
<div class="w-full h-screen bg-black text-white flex flex-col items-center p-6">
  
  <!-- Judge Name -->
  <h1 class="text-3xl font-bold mb-6">{judgeName}</h1>

  <!-- Current Athlete -->
  {#if currentAthlete}
    <div class="text-2xl font-bold text-yellow-400 mb-6">
      Scoring: {currentAthlete.name}
    </div>

    <!-- Score Input -->
    <div class="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-6 shadow-lg">
      <label class="text-lg text-gray-300 mb-2">Score</label>
      <input 
        type="number" 
        min="0" 
        max="10" 
        step="0.1" 
        bind:value={score} 
        class="text-black text-4xl font-bold w-28 text-center rounded-lg p-2"
      />
    </div>

    <!-- Submit Button -->
    <button 
      class="btn btn-success text-2xl font-bold mt-8 px-10 py-4 rounded-2xl"
      on:click={submitScore}>
      Submit Score
    </button>
  {:else}
    <div class="text-gray-400 mt-20">Waiting for current athlete...</div>
  {/if}
</div>
