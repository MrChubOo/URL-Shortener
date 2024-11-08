<script setup lang="ts">
import { LoaderIcon, TriangleAlert } from 'lucide-vue-next'

const { code } = useRoute().params
const isFound = ref(false)
const loading = ref(true)

async function validateCode() {
  loading.value = true
  const result = await $fetch('/api/link/validate', {
    method: 'POST',
    body: { code }
  })

  if (!result.success) {
    isFound.value = false
    return
  }
  else {
    isFound.value = true
    const longUrl = result.data.longUrl
    await navigateTo(longUrl, {
      external: true
    })
  }
  loading.value = false
}

onBeforeMount(() => {
  validateCode()
})
</script>

<template>
  <div>
    <div v-if="loading">
      <LoaderIcon class="animate-spin h-10 w-10 mx-auto" />
    </div>
    <div v-if="!isFound && !loading">
      <div class="flex flex-col items-center justify-center bg-background text-foreground">
        <TriangleAlert class="h-20 w-20 text-yellow-500 mb-4" />
        <h1 class="text-4xl font-bold mb-2">
          404 - Link Not Found
        </h1>
        <p class="text-xl mb-8">
          Oops! The link you're looking for doesn't exist.
        </p>
        <Button as-child>
          <NuxtLink to="/">
            Return Home
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
