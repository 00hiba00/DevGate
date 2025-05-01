<template>
  <div :class="['objectif-list', viewMode]">
    <div
      v-for="objectif in objectifs"
      :key="objectif.id"
      class="objectif-card"
    >
      <h3 class="font-bold text-lg">{{ objectif.title }}</h3>
      <p><strong>Durée :</strong> {{ objectif.duree }}</p>

      <!-- Radial Progress Chart -->
      <div class="chart-container">
        <apexchart
          type="radialBar"
          :options="getChartOptions(objectif)"
          :series="[objectif.progres]"
          width="150"
          height="150"
        />
      </div>

      <!-- Statut -->
      <div class="status-section">
        <strong>Statut :</strong>
        <span
          :class="[
            'status',
            objectif.status === 'Terminé' ? 'completed' : 'in-progress',
          ]"
        >
          {{ objectif.status }}
        </span>
      </div>

      <div class="mt-3 flex gap-2">
        <button @click="editObjectif(objectif)">Modifier</button>
        <button @click="$emit('delete', objectif)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { defineComponent } from 'vue'

defineComponent({
  components: {
    apexchart: VueApexCharts,
  },
})

const props = defineProps({
  objectifs: Array,
  viewMode: String,
})

const emit = defineEmits(['delete', 'edit'])

const editObjectif = (objectif) => {
  emit('edit', objectif)
}

// Function to get color based on progress %
const getProgressColor = (value) => {
  if (value < 50) return '#FF4560' // red
  if (value < 80) return '#FEB019' // yellow
  return '#00E396' // green
}

// Build ApexCharts options per objectif
const getChartOptions = (objectif) => ({
  chart: {
    type: 'radialBar',
    offsetY: 0,
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '60%',
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '14px',
        },
        value: {
          fontSize: '18px',
          show: true,
          formatter: (val) => `${val}%`,
        },
      },
    },
  },
  labels: [objectif.title],
  colors: [getProgressColor(objectif.progres)],
})
</script>

<style scoped>
.objectif-card {
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.objectif-card:hover {
  transform: translateY(-5px);
}

.objectif-card button {
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

.objectif-card button:hover {
  background-color: #36976f;
}

/* Radial chart container */
.chart-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

/* Status style */
.status-section {
  margin-top: 1rem;
}

.status {
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.in-progress {
  background-color: #ffe08a;
  color: #8a6d00;
}

.completed {
  background-color: #c8f7c5;
  color: #2c7a2c;
}
</style>
