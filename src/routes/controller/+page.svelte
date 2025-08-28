<script lang="ts">
  import { onMount } from "svelte";
  import { io, Socket } from "socket.io-client";

  let socket: Socket;
  let baseUrl = "http://localhost:5173/judges?name=";

  // Table data structure
  let table: {
    j1: { red: number[]; blue: number[] };
    j2: { red: number[]; blue: number[] };
    j3: { red: number[]; blue: number[] };
  }[] = [
    { j1: { red: [], blue: [] }, j2: { red: [], blue: [] }, j3: { red: [], blue: [] } }
  ];

  async function connectSocket() {
    try {
      // ask server for its LAN IP
      const res = await fetch("http://localhost:3000/ip");
      const data = await res.json();
      console.log("the data is", data);
      const serverIp = data.ip || "localhost";

      socket = io(`http://${serverIp}:3000`);
      baseUrl = `http://${serverIp}:5173/judges?name=`;

      console.log("🔗 Summary connected to:", serverIp);

      // Handle scores
      socket.on("judge-score", (data: { judge: string; color: "red" | "blue"; score: number }) => {
        console.log("📩 Summary received:", data);
        const judgeKey = data.judge.toLowerCase() as "j1" | "j2" | "j3";

        if (table[0][judgeKey]) {
          table[0][judgeKey][data.color].push(1);
          table = [...table];
        }
      });

      // Handle reset
      socket.on("reset-scores", () => {
        console.log("🧹 Reset received on summary");
        resetTable();
      });
    } catch (err) {
      console.error("⚠️ Could not fetch IP, falling back to localhost", err);
      socket = io("http://localhost:3000");
    }
  }

  function resetTable() {
    table = [
      { j1: { red: [], blue: [] }, j2: { red: [], blue: [] }, j3: { red: [], blue: [] } }
    ];
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied: ${text}`);
    });
  }

  onMount(() => {
    connectSocket();
  });
</script>

<div class="w-full h-screen bg-gray-900 text-white p-6 flex flex-col">
  <h1 class="text-3xl font-bold mb-6">Judges Summary Screen</h1>

  <!-- Judges Links -->
  <div class="mb-6 grid grid-cols-3 gap-4">
    {#each ["j1", "j2", "j3"] as judge}
      <div class="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
        <span class="mb-2 text-lg font-semibold uppercase">{judge}</span>
        <div class="flex items-center gap-2">
          <input
            class="bg-gray-700 text-white px-2 py-1 rounded w-48 text-sm"
            type="text"
            readonly
            value={`${baseUrl}${judge}`}
          />
          <button
            class="btn btn-primary btn-sm"
            on:click={() => copyToClipboard(`${baseUrl}${judge}`)}
          >
            Copy
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Table -->
  <div class="flex-1 overflow-x-auto">
    <table class="table-auto border-collapse border border-gray-500 w-full text-center">
      <thead>
        <tr class="bg-gray-700">
          <th class="border border-gray-500 px-4 py-2">J1 RED</th>
          <th class="border border-gray-500 px-4 py-2">J1 BLUE</th>
          <th class="border border-gray-500 px-4 py-2">J2 RED</th>
          <th class="border border-gray-500 px-4 py-2">J2 BLUE</th>
          <th class="border border-gray-500 px-4 py-2">J3 RED</th>
          <th class="border border-gray-500 px-4 py-2">J3 BLUE</th>
        </tr>
      </thead>
      <tbody>
        {#each Array(Math.max(
          table[0].j1.red.length,
          table[0].j1.blue.length,
          table[0].j2.red.length,
          table[0].j2.blue.length,
          table[0].j3.red.length,
          table[0].j3.blue.length
        )).fill(0) as _, rowIndex}
          <tr>
            <td class="border border-gray-500 py-2">{table[0].j1.red[rowIndex] || ""}</td>
            <td class="border border-gray-500 py-2">{table[0].j1.blue[rowIndex] || ""}</td>
            <td class="border border-gray-500 py-2">{table[0].j2.red[rowIndex] || ""}</td>
            <td class="border border-gray-500 py-2">{table[0].j2.blue[rowIndex] || ""}</td>
            <td class="border border-gray-500 py-2">{table[0].j3.red[rowIndex] || ""}</td>
            <td class="border border-gray-500 py-2">{table[0].j3.blue[rowIndex] || ""}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Reset Button -->
  <div class="mt-6">
    <button class="btn btn-error px-6 py-2 text-xl" on:click={resetTable}>Reset</button>
  </div>
</div>
