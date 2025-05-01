<template>
    <div class="max-w-3xl mx-auto p-6">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Historique d'activités</h2>
      <div class="flex flex-wrap justify-center gap-4 mb-6">
        <!-- Période -->
        <select v-model="selectedPeriod" class="p-2 rounded border">
            <option value="all">Toutes les périodes</option>
            <option value="today">Aujourd’hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois-ci</option>
        </select>

        <!-- Catégorie -->
        <select v-model="selectedCategory" class="p-2 rounded border">
            <option value="all">Toutes les catégories</option>
            <option value="projet">Projet</option>
            <option value="competence">Compétence</option>
            <option value="objectif">Objectif</option>
        </select>

        <!-- Type -->
        <select v-model="selectedType" class="p-2 rounded border">
            <option value="all">Tous les types</option>
            <option value="ajout">Ajout</option>
            <option value="supression">Suppression</option>
            <option value="modification">Modification</option>
        </select>
        </div>
      <ul class="relative border-l border-blue-300 space-y-10">
        <li v-motion
          v-for="(activity) in filteredActivities"
          :key="activity.id"
          tag="li"
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0 }"
          class="ml-6"
        >
          <div class="absolute -left-3 top-1.5 bg-white border-4 border-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-sm">
            <span>{{ getIcon(activity.category) }}</span>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
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
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  
  import { listenToActivities } from '@/composables/useFirestore'
  

  const selectedPeriod = ref('all') // 'today' | 'week' | 'month' | 'all'
  const selectedCategory = ref('all') // 'projet' | 'competence' | 'objectif' | 'all'
  const selectedType = ref('all') // 'ajout' | 'suppression' | 'modification' | 'all'
  const activities = ref([])
  
  onMounted(() => {
    listenToActivities((newActivities) => {
      activities.value = newActivities
      console.log("fetched activities : ", activities);
    })
  })
  
  const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  
  // Handle Firestore Timestamp or plain Date object
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
  let unsubscribe

onMounted(() => {
  unsubscribe = listenToActivities((newActivities) => {
    activities.value = newActivities
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const filteredActivities = computed(() => {
  const now = new Date()
  return activities.value.filter((a) => {
    if (!a.date) return false;
    const date = typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)

    const matchPeriod = () => {
      if (selectedPeriod.value === 'today') {
        return date.toDateString() === now.toDateString()
      } else if (selectedPeriod.value === 'week') {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)
        return date >= startOfWeek && date < endOfWeek
      } else if (selectedPeriod.value === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }
      return true // 'all'
    }

    const matchCategory = selectedCategory.value === 'all' || a.category === selectedCategory.value
    const matchType = selectedType.value === 'all' || a.type.toLowerCase().includes(selectedType.value)

    return matchPeriod() && matchCategory && matchType
  })
})
  </script>
  