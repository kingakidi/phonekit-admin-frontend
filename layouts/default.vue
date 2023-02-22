<template>
  <div class="flex min-h-full">
    <Sidebar class="fixed min-h-full" />
    <main class="main ml-40 flex-1 flex flex-col">
      <Navbar />
      <div class="content flex-1 p-4">
        <slot class="mt-10" />
      </div>
    </main>
  </div>
</template>

<script setup></script>
