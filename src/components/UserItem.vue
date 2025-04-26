<template>
    <b-card class="user-card">
      <b-card-header>
        <h5>{{ user.name }}</h5>
      </b-card-header>
      <b-card-body>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <span class="status-indicator" :class="{ online: user.status, offline: !user.status }"></span>
        <b-button @click="viewProfile" variant="outline-primary">View Profile</b-button>
      </b-card-body>
    </b-card>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const viewProfile = () => {
  router.push({ name: 'Profile', params: { userId: props.user.uid } });
};
</script>
<style scoped>
.user-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  border: none;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  background-color: #fff;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  background-color: #f9f9fb;
}

.b-card-header {
  background-color: #f1f3f5;
  border-bottom: 2px solid #e9ecef;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
}

.b-card-header h5 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.b-button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  background-color: #007bff;
  color: white;
  border: none;
  transition: background-color 0.3s, transform 0.2s;
}

.b-button:hover {
  background-color: #0069d9;
  transform: scale(1.05);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 12px;
}

.status-indicator.online {
  background-color: #28a745;
}

.status-indicator.offline {
  background-color: #dc3545;
}
</style>
