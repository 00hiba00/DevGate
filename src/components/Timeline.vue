<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Historique d'activités</h2>

    <!-- Filters -->
    <div class="flex flex-wrap justify-center gap-4 mb-6">
      <select v-model="selectedPeriod" class="p-2 rounded border">
        <option value="all">Toutes les périodes</option>
        <option value="today">Aujourd’hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois-ci</option>
      </select>

      <select v-model="selectedCategory" class="p-2 rounded border">
        <option value="all">Toutes les catégories</option>
        <option value="projet">Projet</option>
        <option value="competence">Compétence</option>
        <option value="objectif">Objectif</option>
      </select>

      <select v-model="selectedType" class="p-2 rounded border">
        <option value="all">Tous les types</option>
        <option value="ajout">Ajout</option>
        <option value="suppression">Suppression</option>
        <option value="modification">Modification</option>
      </select>
    </div>

    <!-- 🔹 ApexCharts Timeline -->
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    />

    <!-- 🔘 Toggle Button -->
    <button
      @click="showDetails = !showDetails"
      class="bg-blue-500 text-white px-4 py-2 mt-6 rounded hover:bg-blue-600"
    >
      {{ showDetails ? 'Masquer la liste détaillée' : 'Afficher la liste détaillée' }}
    </button>

    <!-- 📝 Detailed Timeline (Toggle) -->
    <ul v-if="showDetails" class="relative border-l border-blue-300 space-y-10 mt-6">
      <li
        v-motion
        v-for="(activity) in filteredActivities"
        :key="activity.id"
        tag="li"
        :initial="{ opacity: 0, x: -40 }"
        :enter="{ opacity: 1, x: 0 }"
        class="ml-6"
      >
        <div
          class="absolute -left-3 top-1.5 bg-[#1e1e2e] border-4 border-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-sm"
        >
          <span>{{ getIcon(activity.category) }}</span>
        </div>
        <!-- Add activity-card class here -->
        <div class="activity-card">
          <p class="text-gray-800">
            <span class="font-semibold capitalize text-blue-600">{{ activity.type }}</span>
            {{ formatCategory(activity.category) }} :
            <span class="font-semibold text-gray-900">{{ activity.details?.titre || '...' }}</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">{{ formatDate(activity.date) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import { listenToActivities } from '@/composables/useFirestore'

const selectedPeriod = ref('all')
const selectedCategory = ref('all')
const selectedType = ref('all')
const activities = ref([])
const showDetails = ref(false)

let unsubscribe

onMounted(() => {
  unsubscribe = listenToActivities((newActivities) => {
    activities.value = newActivities
    console.log("Fetched activities: ", newActivities)
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  const jsDate = typeof date.toDate === 'function' ? date.toDate() : new Date(date)
  return jsDate.toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const formatCategory = (cat) => {
  const map = {
    projet: 'projet',
    competence: 'compétence',
    objectif: 'objectif'
  }
  return map[cat] || cat
}

const getIcon = (category) => {
  switch (category) {
    case 'projet': return '🛠️'
    case 'competence': return '💡'
    case 'objectif': return '📌'
    default: return '📁'
  }
}

const filteredActivities = computed(() => {
  const now = new Date()
  return activities.value.filter((a) => {
    if (!a.date) return false
    const date = typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)

    const matchPeriod = () => {
      if (selectedPeriod.value === 'today') {
        return date.toDateString() === now.toDateString()
      } else if (selectedPeriod.value === 'week') {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)
        return date >= startOfWeek && date < endOfWeek
      } else if (selectedPeriod.value === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }
      return true
    }

    const matchCategory = selectedCategory.value === 'all' || a.category === selectedCategory.value
    const matchType = selectedType.value === 'all' || a.type.toLowerCase().includes(selectedType.value)

    return matchPeriod() && matchCategory && matchType
  })
})

const chartSeries = computed(() => {
  const dateCountMap = {}
  filteredActivities.value.forEach((a) => {
    const d = typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)
    const key = d.toLocaleDateString('fr-FR')
    dateCountMap[key] = (dateCountMap[key] || 0) + 1
  })

  return [
    {
      name: 'Activités',
      data: Object.values(dateCountMap)
    }
  ]
})

const chartOptions = computed(() => {
  const labels = Object.keys(
    filteredActivities.value.reduce((acc, a) => {
      const d = typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)
      const key = d.toLocaleDateString('fr-FR')
      acc[key] = true
      return acc
    }, {})
  )

  return {
    chart: {
      id: 'timeline-chart',
      toolbar: { show: false }
    },
    xaxis: {
      categories: labels,
      title: { text: 'Date' }
    },
    yaxis: {
      title: { text: 'Nombre d\'activités' }
    },
    colors: ['#3b82f6']
  }
})
</script>

<style scoped>
/* General Background */
body {
  background-color: #1e1e2e; /* Dark background for the whole page */
  color: #ffffff; /* Default white text color */
  font-family: 'Arial', sans-serif; /* Optional font for readability */
}

/* Container for the whole section */
.max-w-4xl {
  background-color: #1e1e2e; /* Dark background for the container */
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Title */
h2 {
  color: #ffffff; /* White title color */
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
}

/* Filters */
select {
  background-color: #7c3aed; /* Violet background for select buttons */
  color: #ffffff; /* White text inside select buttons */
  padding: 12px;
  border: 1px solid #7c3aed;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

select:hover {
  background-color: #9b4de0; /* Lighter violet on hover */
}

/* Show Historique Button */
button {
  background-color: #7c3aed; /* Violet background for the button */
  color: #ffffff; /* White text color */
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #9b4de0; /* Lighter violet on hover */
}

/* Activity Item Background */
.activity-card {
  background-color: #1e1e2e; /* Black background for each activity card */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 12px;
}

.activity-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
}

/* Activity Text */
.activity-card p {
  color: #ffffff; /* White text for activity description */
}

.activity-card .category {
  color: #7c3aed; /* Violet text for the category */
  font-weight: bold;
}

.activity-card .details {
  font-size: 0.9rem;
  color: #aaa; /* Light gray for details */
}

.activity-card .date {
  font-size: 0.8rem;
  color: #888; /* Darker gray for the date */
}

/* Historical List Container */
ul {
  list-style-type: none;
  padding-left: 0;
  margin-top: 24px;
}

ul li {
  position: relative;
  margin-left: 24px;
}

/* Timeline Activity Icons */
ul li .icon {
  position: absolute;
  left: -12px;
  top: 10px;
  background-color: #7c3aed; /* Violet icon background */
  color: #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Select Dropdown and Buttons Container */
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

/* General Form Inputs */
input, textarea {
  background-color: #333333; /* Dark input fields */
  border: 1px solid #555555;
  color: #ffffff;
  border-radius: 8px;
  padding: 12px;
}

input::placeholder, textarea::placeholder {
  color: #777777;
}
</style>
