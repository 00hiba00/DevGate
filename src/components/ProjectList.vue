<template>
  <div :class="['project-list', viewMode]">
    <div v-for="project in projects" :key="project.id" class="project-card">
      <div class="project-header">
        <h3 class="font-bold text-lg">{{ project.title }}</h3>
        <span :class="['visibility-badge', project.visibility]">
          {{ project.visibility === 'public' ? 'Public' : 'Privé' }}
        </span>
      </div>
      <p>{{ project.description }}</p>
      <p><strong>Stack :</strong> {{ project.stack.join(', ') }}</p>
      <a :href="project.github" target="_blank" class="text-blue-500 underline">
        Voir sur GitHub
      </a>
      <div class="mt-3 flex gap-2">
        <button @click="editProject(project)">Modifier</button>
        <button @click="$emit('delete', project)">Supprimer</button>
        <button @click="toggleTimer(project)">
          {{ activeProjectId === project.id ? 'Stop Timer' : 'Start Timer' }}
        </button>
      </div>

      <!-- Heatmap Chart -->
      <HeatmapChart
  v-if="chartData[project.id]?.length"
  :series="chartSeries(project.id)"
  :options="chartOptions"
  :height="200"
/>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebase.js'
import apexchart from 'vue3-apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import HeatmapChart from './HeatmapChart.vue'

const activeProjectId = ref(null)
const timerStartTime = ref(null)
const chartData = ref({})

const chartOptions = ref({
  chart: { 
    type: 'heatmap',
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category'
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          { from: 0, to: 59, name: '< 1h', color: '#d4f4fa' },
          { from: 60, to: 239, name: '1–4h', color: '#4db6ac' },
          { from: 240, to: 1440, name: '4h+', color: '#00796b' }
        ]
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val) => `${Math.floor(val / 60)}h ${val % 60}min`
    }
  }
})

const props = defineProps({
  projects: Array,
  viewMode: String
})

const emit = defineEmits(['delete', 'edit'])

// Add this computed property
const chartSeries = computed(() => (projectId) => {
  return [{ 
    name: 'Temps (min)', 
    data: chartData.value[projectId] || [] 
  }]
})

const fetchSessions = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'work_sessions'))
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const grouped = {}

    for (const project of props.projects) {
      const projectSessions = sessions.filter(s => s.projectId === project.id)
      const data = {}

      for (const session of projectSessions) {
        if (session.startTime && session.endTime) {
          const start = session.startTime.toDate()
          const end = session.endTime.toDate()
          const minutes = Math.round((end - start) / 60000)
          const dateKey = start.toISOString().split('T')[0]
          
          if (data[dateKey]) {
            data[dateKey] += minutes
          } else {
            data[dateKey] = minutes
          }
        }
      }

      grouped[project.id] = Object.entries(data).map(([x, y]) => ({ x, y }))
    }

    chartData.value = grouped
  } catch (error) {
    console.error("Error fetching sessions:", error)
  }
}

watch(() => props.projects, (newProjects) => {
  if (newProjects?.length) fetchSessions()
}, { immediate: true })

const editProject = (project) => {
  emit('edit', project)
}

const toggleTimer = async (project) => {
  const auth = getAuth()
  const user = auth.currentUser
  
  if (!user) {
    alert("Connectez-vous pour utiliser le timer.")
    return
  }

  if (activeProjectId.value === project.id) {
    // Stop timer
    const endTime = new Date()
    try {
      await addDoc(collection(db, 'work_sessions'), {
        userId: user.uid,
        projectId: project.id,
        startTime: Timestamp.fromDate(timerStartTime.value),
        endTime: Timestamp.fromDate(endTime)
      })
      await fetchSessions() // Refresh data after stopping timer
    } catch (error) {
      console.error("Error saving session:", error)
    }
    activeProjectId.value = null
    timerStartTime.value = null
  } else {
    // Start timer
    activeProjectId.value = project.id
    timerStartTime.value = new Date()
  }
}
</script>

<style scoped>
.project-card {
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease;
  margin-bottom: 1.5rem;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.visibility-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.visibility-badge.public {
  background-color: #42b983;
  color: white;
}

.visibility-badge.private {
  background-color: #e74c3c;
  color: white;
}

.project-card button {
  margin-right: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  background-color: #42b983;
  color: white;
  transition: background-color 0.2s;
}

.project-card button:hover {
  background-color: #36976f;
}

.project-card button:last-child {
  margin-right: 0;
}
</style>