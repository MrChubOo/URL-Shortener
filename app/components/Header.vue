<script setup lang="ts">
import { Sun, Moon, BarChart } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container max-w-2xl h-14 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <NuxtImg
          src="/icon.png"
          :height="30"
          :width="30"
          loading="lazy"
        />
        <NuxtLink
          to="/"
          class="font-bold"
        >
          URL Shortener
        </NuxtLink>
      </div>
      <nav class="flex items-center space-x-6 text-sm font-medium">
        <NuxtLink
          to="/stats"
          class="transition-colors hover:text-foreground/80 flex items-center"
          active-class="font-bold underline underline-offset-2"
        >
          <BarChart class="h-4 w-4 mr-2 inline-block" />
          URL Stats
        </NuxtLink>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Theme"
          class="mr-6"
          @click="toggleColorMode"
        >
          <Sun class="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle Theme</span>
        </Button>
      </nav>
    </div>
  </header>
</template>
