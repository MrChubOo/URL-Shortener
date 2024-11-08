<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      <div class=" container max-w-2xl p-4 md:p-8 pt-4 md:pt-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  font-family: "Inter", sans-serif;
}
</style>
