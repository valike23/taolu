<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { onMount } from "svelte";

  export let judgeName = "J1"; // default fallback

  let redScore: number = 7.0;
  let blueScore: number = 7.0;
  let socket: Socket;
  let host = "";

  async function connectSocket() {
    try {
      console.log("testing host", host);
      // Fetch server IP dynamically
      const res = await fetch(`http://${host}:3000/ip`);
      const data = await res.json();
      const serverIp = data.ip || "localhost";

      socket = io(`http://${serverIp}:3000`);
      console.log("🔗 Connected to server:", serverIp);
    } catch (err) {
      console.error("⚠️ Could not fetch server IP, falling back to localhost", err);
      socket = io("http://localhost:3000");
    }
  }

  onMount(async () => {
    host = location.host.split(":")[0];
    console.log(host);
    await connectSocket();

    // Get judge name from query param (?name=j1)
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      judgeName = name.toUpperCase(); // e.g. J1 → "J1"
    }
  });

  function submitScores() {
    if (!socket) return;
    socket.emit("judge-score", {
      judge: judgeName.toLowerCase(),
      red: redScore,
      blue: blueScore
    });
    console.log("✅ Scores submitted:", { redScore, blueScore });
  }
</script>

<!-- Judge Screen -->
<div class="w-full h-screen bg-black text-white flex flex-col items-center p-6">
  
  <!-- Judge Name -->
  <h1 class="text-3xl font-bold mb-6">{judgeName}</h1>
  
  <!-- Scores Area -->
  <div class="grid grid-cols-2 gap-6 w-full max-w-4xl flex-1">
    
    <!-- Red Athlete Input -->
    <div class="flex flex-col items-center justify-center bg-red-900 rounded-2xl p-6 shadow-lg">
      <label class="text-2xl text-red-200 font-bold mb-4">RED</label>
      <input 
        type="number" 
        min="0" 
        max="10" 
        step="0.1" 
        bind:value={redScore} 
        class="text-black text-4xl font-bold w-28 text-center rounded-lg p-2"
      />
    </div>
    
    <!-- Blue Athlete Input -->
    <div class="flex flex-col items-center justify-center bg-blue-900 rounded-2xl p-6 shadow-lg">
      <label class="text-2xl text-blue-200 font-bold mb-4">BLUE</label>
      <input 
        type="number" 
        min="0" 
        max="10" 
        step="0.1" 
        bind:value={blueScore} 
        class="text-black text-4xl font-bold w-28 text-center rounded-lg p-2"
      />
    </div>
  
  </div>

  <!-- Submit Button -->
  <button 
    class="btn btn-success text-2xl font-bold mt-8 px-10 py-4 rounded-2xl"
    on:click={submitScores}>
    Submit Scores
  </button>
</div>
