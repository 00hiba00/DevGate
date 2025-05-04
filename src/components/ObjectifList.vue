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
        <button @click="confirmDelete(objectif)">Supprimer</button>
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

const confirmDelete = (objectif) => {
  if (confirm(`Es-tu sûr de vouloir supprimer "${objectif.title}" ?`)) {
    emit('delete', objectif)
  }
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

<style>
@import '../assets/styles/objectiflist.css';
</style>
