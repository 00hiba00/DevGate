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
  /* Profile Container */
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1f1f2f;
  color: #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(102, 51, 153, 0.3);
}

/* Header */
.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 2rem;
  color: #b084f6;
  font-weight: bold;
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

/* Avatar Section */
.avatar-section {
  text-align: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.profile-avatar,
.default-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #b084f6;
  background-color: #2a2a3d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ccc;
  font-weight: bold;
}

.upload-btn {
  padding: 0.4rem 1rem;
  background-color: #6a4fcf;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #7f5ff5;
}

/* Profile Details */
.profile-details {
  width: 100%;
  max-width: 500px;
  background-color: #2a2a3d;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(176, 132, 246, 0.1);
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-item label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #b084f6;
}

.detail-item p {
  margin: 0;
  font-size: 1rem;
  color: #ddd;
}

/* Responsive */
@media (min-width: 768px) {
  .profile-content {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .avatar-section {
    flex: 1;
  }

  .profile-details {
    flex: 2;
  }
}

  </style>
