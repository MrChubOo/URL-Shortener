<script setup lang="ts">
import type { ClickData } from '~~/types'

const sampleUrl = ref('')
const shortUrl = ref<string>('')
const stats = ref<ClickData | null>(null)
const loading = ref<boolean>(false)
const years = ref<string[]>([])
const selectedYear = ref<string>('')

const shortUrlCode = computed(() => extractId(shortUrl.value))

const mockData: ClickData = {
  2021: {
    totalClicks: 15000,
    monthlyClicks: [
      { month: 'Jan', clicks: 1200 },
      { month: 'Feb', clicks: 1500 },
      { month: 'Mar', clicks: 1800 },
      { month: 'Apr', clicks: 1300 },
      { month: 'May', clicks: 1100 },
      { month: 'Jun', clicks: 1400 },
      { month: 'Jul', clicks: 1600 },
      { month: 'Aug', clicks: 1200 },
      { month: 'Sep', clicks: 1000 },
      { month: 'Oct', clicks: 900 },
      { month: 'Nov', clicks: 1100 },
      { month: 'Dec', clicks: 900 }
    ]
  },
  2022: {
    totalClicks: 18000,
    monthlyClicks: [
      { month: 'Jan', clicks: 1400 },
      { month: 'Feb', clicks: 1600 },
      { month: 'Mar', clicks: 1900 },
      { month: 'Apr', clicks: 1500 },
      { month: 'May', clicks: 1300 },
      { month: 'Jun', clicks: 1600 },
      { month: 'Jul', clicks: 1800 },
      { month: 'Aug', clicks: 1400 },
      { month: 'Sep', clicks: 1200 },
      { month: 'Oct', clicks: 1100 },
      { month: 'Nov', clicks: 1300 },
      { month: 'Dec', clicks: 1100 }
    ]
  },
  2023: {
    totalClicks: 22000,
    monthlyClicks: [
      { month: 'Jan', clicks: 1700 },
      { month: 'Feb', clicks: 1900 },
      { month: 'Mar', clicks: 2200 },
      { month: 'Apr', clicks: 1800 },
      { month: 'May', clicks: 1600 },
      { month: 'Jun', clicks: 1900 },
      { month: 'Jul', clicks: 2100 },
      { month: 'Aug', clicks: 1700 },
      { month: 'Sep', clicks: 1500 },
      { month: 'Oct', clicks: 1400 },
      { month: 'Nov', clicks: 1600 },
      { month: 'Dec', clicks: 1400 }
    ]
  }
}

function extractId(url: string) {
  const regex = /\/([a-zA-Z0-9]+)$/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function handleSubmit(e: Event) {
  e.preventDefault()
  loading.value = true
  stats.value = null
  selectedYear.value = ''
  years.value = []

  if (shortUrlCode.value?.toLowerCase() === 'test') {
    stats.value = mockData
    years.value = ['2021', '2022', '2023']
    selectedYear.value = '2023'
  }
  else {
    const result = await $fetch('/api/stats', {
      query: {
        code: shortUrlCode.value,
        year: selectedYear.value
      }
    })

    if (result) {
      stats.value = result.clickData
      years.value = result.years
      selectedYear.value = result.years[0] ?? ''
    }
  }

  loading.value = false
}

onMounted(() => {
  sampleUrl.value = `${window.location.origin}/test`
})
</script>

<template>
  <div>
    <Card class="w-full mx-auto mb-8">
      <CardHeader>
        <CardTitle>URL Statistics</CardTitle>
        <CardDescription>
          Enter a shortened URL to view its statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-4"
          @submit="handleSubmit"
        >
          <div class="space-y-2">
            <Label html-for="shortUrl">Shortened URL</Label>
            <Input
              id="shortUrl"
              v-model="shortUrl"
              type="url"
              :placeholder="`Example: ${sampleUrl}`"
              :disabled="loading"
            />
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            View Stats
          </Button>
        </form>
      </CardContent>
    </Card>

    <Card
      v-if="stats"
      class="w-full mx-auto mb-8"
    >
      <CardHeader>
        <CardTitle>Short URL: {{ shortUrl }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3
              v-if="selectedYear"
              class="text-lg font-semibold"
            >
              Total Clicks in {{ selectedYear }}
            </h3>
            <p
              v-if="stats"
              class="text-3xl font-bold"
            >
              {{ stats[selectedYear]?.totalClicks ?? 0 }}
            </p>
          </div>
          <Select
            v-if="stats"
            v-model="selectedYear"
          >
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="(year, index) in Object.keys(stats!)"
                :key="index"
                :value="year"
              >
                {{ year }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <BarChart
          v-if="selectedYear && stats && stats[selectedYear]"
          :data="stats[selectedYear]?.monthlyClicks || []"
          index="month"
          :categories="['clicks']"
        />
      </CardContent>
    </Card>

    <Card v-else>
      <CardHeader>
        <CardTitle>No stats found!</CardTitle>
        <CardDescription>{{ shortUrl }}</CardDescription>
      </CardHeader>
    </Card>
  </div>
</template>
