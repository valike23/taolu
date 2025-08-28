<script lang="ts">
    import { onDestroy, onMount } from "svelte";

  let redName = "JAMES ESHO";
  let blueName = "KUNLE JOB";
  let redScore = 0;
  let blueScore = 0;
  let round = 1;
  let weightClass = "-45KG";
  let timer = 30 * 10; // store in deciseconds (tenths of seconds) → 30.0s
  let interval: NodeJS.Timeout | null = null;
  let running = false;

  function startTimer() {
    if (!running) {
      running = true;
      interval = setInterval(() => {
        if (timer > 0) {
          timer -= 1; // subtract 0.1 second
        } else {
          stopTimer();
        }
      }, 100); // 100ms = 0.1s
    }
  }

  function stopTimer() {
    running = false;
    if (interval) clearInterval(interval);
    interval = null;
  }

  function resetTimer(seconds: number = 30) {
    stopTimer();
    timer = seconds * 10;
  }

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  // Format timer as mm:ss.d
  function formatTime(t: number) {
    const totalSeconds = Math.floor(t / 10);
    const deci = t % 10;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${deci}`;
  }

  onMount(()=>{
    startTimer()
  })
</script>

<div class="w-full h-screen bg-black flex flex-col text-white font-bold">
  <!-- 🔴 RED ROW -->
  <div class="flex flex-col bg-[#2a1a1a] flex-1 relative px-6 py-4">
    <!-- Label -->
    <div class="absolute top-2 left-4 text-4xl text-red-500">RED</div>

    <!-- Name + Score -->
    <div class="flex justify-between items-center mt-6">
      <h1 class="text-5xl">{redName}</h1>
      <div class="text-red-500 text-8xl">{redScore}</div>
    </div>

    <!-- Indicators -->
    <div class="flex justify-center gap-8 mt-4 text-xl tracking-wide text-red-400">
      <span>AD</span>
      <span>WA</span>
      <span>MP</span>
      <span>FO</span>
      <span>FC</span>
    </div>
  </div>

  <!-- 🔵 BLUE ROW -->
  <div class="flex flex-col bg-[#0f1a2b] flex-1 relative px-6 py-4">
    <!-- Label -->
    <div class="absolute top-2 left-4 text-4xl text-blue-400">BLUE</div>

    <!-- Name + Score -->
    <div class="flex justify-between items-center mt-6">
      <h1 class="text-5xl">{blueName}</h1>
      <div class="text-blue-400 text-8xl">{blueScore}</div>
    </div>

    <!-- Indicators -->
    <div class="flex justify-center gap-8 mt-4 text-xl tracking-wide text-blue-300">
      <span>AD</span>
      <span>WA</span>
      <span>MP</span>
      <span>FO</span>
      <span>FC</span>
    </div>
  </div>

  <!-- ⏱️ TIMER ROW -->
  <div class="bg-black flex flex-col items-center justify-center h-1/3 relative">
    <!-- Weight class -->
    <div class="absolute left-6 top-6 text-3xl">{weightClass}</div>

    <!-- Timer -->
    <div class="text-7xl font-mono">
      {Math.floor(timer/60)}:{(timer % 60).toString().padStart(2, "0")}.0
    </div>

    <!-- Logo placeholder -->
    <div class="absolute right-6 top-6">
      <div class="w-24 h-12 bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center rounded">
        LOGO
      </div>
    </div>

    <!-- Round -->
    <div class="absolute bottom-4 text-3xl">R{round}/3</div>
  </div>
</div>
