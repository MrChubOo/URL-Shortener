<script setup lang="ts">
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const longUrl = ref('')
const loading = ref(false)
const shortUrl = ref('')
const error = ref('')

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  error.value = ''
  shortUrl.value = ''

  const result = await $fetch('/api/link/shorten', {
    method: 'post',
    body: JSON.stringify({
      longUrl: longUrl.value
    })
  })

  try {
    if (!result.success) {
      error.value = result.error
    }
    else {
      const newShortUrl = `${window.location.origin}/${result.data.code}`
      shortUrl.value = newShortUrl
    }
    loading.value = false
  }
  catch (err: any) {
    error.value = err.message || 'Something\'s wrong in the server'
    loading.value = false
  }
}
</script>

<template>
  <div>
    <Card class="w-full mx-auto">
      <CardHeader>
        <CardTitle>Shorten Your URL</CardTitle>
        <CardDescription>Enter a long URL to get a shortened version</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-4"
          @submit="handleSubmit"
        >
          <div class="space-y-2">
            <Label html-for="longUrl">URL</Label>
            <Input
              id="longUrl"
              v-model="longUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              :disabled="loading"
            />
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            Shorten URL
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col items-start space-y-2">
        <div
          v-if="error"
          class="flex items-center space-x-2 text-red-500"
        >
          <AlertCircle :size="16" />
          <span>{{ error }}</span>
        </div>
        <div
          v-if="shortUrl"
          class="space-y-2 w-full"
        >
          <div class="flex items-center space-x-2 text-green-500">
            <CheckCircle2 :size="16" />
            <span>URL shortened successfully!</span>
          </div>
          <Input
            v-model="shortUrl"
            read-only
          />
        </div>
      </CardFooter>
    </card>
  </div>
</template>
