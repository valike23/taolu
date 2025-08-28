<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { onMount } from "svelte";

  export let judgeName = "J1"; // default fallback

  let redScore = 0;
  let blueScore = 0;
  let socket: Socket;
  let host = '';

  async function connectSocket() {
    try {
      console.log("testing host", host)
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
    host = location.host.split(':')[0];console.log(host)
    await connectSocket();

    // Get judge name from query param (?name=j1)
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (name) {
      judgeName = name.toUpperCase(); // e.g. J1 → "J1"
    }
  });

  function sendScoreUpdate(color: "red" | "blue", score: number) {
    if (!socket) return;
    socket.emit("judge-score", {
      judge: judgeName.toLowerCase(),
      color,
      score
    });
  }

  function incRed() {
    redScore++;
    sendScoreUpdate("red", redScore);
  }

  function decRed() {
    if (redScore > 0) {
      redScore--;
      sendScoreUpdate("red", redScore);
    }
  }

  function incBlue() {
    blueScore++;
    sendScoreUpdate("blue", blueScore);
  }

  function decBlue() {
    if (blueScore > 0) {
      blueScore--;
      sendScoreUpdate("blue", blueScore);
    }
  }
</script>

<!-- Judge Screen -->
<div class="w-full h-screen bg-black text-white flex flex-col items-center p-6">
  
  <!-- Judge Name -->
  <h1 class="text-3xl font-bold mb-6">{judgeName}</h1>
  
  <!-- Scores Area -->
  <div class="grid grid-cols-2 gap-6 w-full max-w-4xl flex-1">
    
    <!-- Red Athlete Controls -->
    <div class="flex flex-col items-center justify-center bg-red-900 rounded-2xl p-6 shadow-lg">
      <button class="btn btn-error text-2xl font-bold mb-4" on:click={incRed}>+1</button>
      <div class="text-7xl font-mono my-6">{redScore}</div>
      <button class="btn btn-outline btn-error text-2xl font-bold mt-4" on:click={decRed}>-1</button>
      <div class="mt-6 text-2xl text-red-200 font-bold">RED</div>
    </div>
    
    <!-- Blue Athlete Controls -->
    <div class="flex flex-col items-center justify-center bg-blue-900 rounded-2xl p-6 shadow-lg">
      <button class="btn btn-info text-2xl font-bold mb-4" on:click={incBlue}>+1</button>
      <div class="text-7xl font-mono my-6">{blueScore}</div>
      <button class="btn btn-outline btn-info text-2xl font-bold mt-4" on:click={decBlue}>-1</button>
      <div class="mt-6 text-2xl text-blue-200 font-bold">BLUE</div>
    </div>
  
  </div>
</div>
