<template>
    <div class="profile-container">
      <div class="profile-header">
        <h2>Mon Profil</h2>
      </div>
  
      <div class="profile-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img 
              v-if="user.photoURL" 
              :src="user.photoURL" 
              alt="Profile Photo"
              class="profile-avatar"
            >
            <div v-else class="default-avatar">
              {{ userInitial }}
            </div>
            <input 
              type="file" 
              ref="fileInput"
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            >
            <button @click="triggerFileInput" class="upload-btn">
              Changer la photo
            </button>
          </div>
        </div>
  
        <div class="profile-details">
          <div class="detail-item">
            <label>Nom:</label>
            <p>{{ user.displayName || user.name || 'Non spécifié' }}</p>
          </div>
          
          <div class="detail-item">
            <label>Email:</label>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getAuth } from 'firebase/auth';
  import { doc, updateDoc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase/firebase';
  
  // Image compression utility
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.readAsDataURL(file);
    });
  };
  
  const auth = getAuth();
  const fileInput = ref(null);
  const user = ref({
    displayName: '',
    email: '',
    photoURL: '' // Changed from photoBase64 to photoURL
  });
  
  const userInitial = computed(() => {
    return user.value.displayName?.charAt(0)?.toUpperCase() || 'U';
  });
  
  const loadUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        user.value = {
          displayName: currentUser.displayName || userDoc.data().name,
          email: currentUser.email,
          photoURL: userDoc.data().photoURL || '' // Changed field name
        };
      } else {
        user.value = {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: ''
        };
      }
    }
  };
  
  onMounted(() => {
    loadUserProfile();
  });
  
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    try {
      // Compress image and get Base64 URL
      const photoURL = await compressImage(file);
      
      // Update Firestore (using photoURL field)
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: photoURL // Saving as photoURL instead of photoBase64
      });
      
      // Update local state
      user.value.photoURL = photoURL;
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a1d; /* fond sombre */
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.2);
  color: #f1f1f1;
}

.profile-header h2 {
  font-size: 2rem;
  color: #7f60f9;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.avatar-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.profile-avatar,
.default-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #9b5de5, #f15bb5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(241, 91, 181, 0.5);
}

.upload-btn {
  padding: 0.6rem 1.4rem;
  background-color: #7f60f9;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-btn:hover {
  background-color: #a084f9;
}

.profile-details {
  flex: 2;
}

.detail-item {
  margin-bottom: 1.8rem;
}

.detail-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #cfcfcf;
  font-weight: 600;
  font-size: 1rem;
}

.detail-item p {
  padding: 0.9rem;
  background: #2d2d32;
  border-radius: 10px;
  color: #e4e4e4;
  font-size: 1.1rem;
  word-break: break-word;
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.05);
}

  </style>