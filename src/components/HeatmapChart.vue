<template>
    <apexchart
      :type="type"
      :options="options"
      :series="series"
      :height="height"
    />
  </template>
  
  <script setup>
  import VueApexCharts from 'vue3-apexcharts'
  
  defineProps({
    type: String,
    options: Object,
    series: Array,
    height: [String, Number]
  })
  
  const apexchart = VueApexCharts
  </script>