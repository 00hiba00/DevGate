import { db } from '@/firebase/firebase.js'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

// Ajouter un projet à Firestore
export const addProjectToFirestore = async (project) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), project)
    console.log('Document ajouté avec l\'ID : ', docRef.id)
  } catch (e) {
    console.error('Erreur lors de l\'ajout du projet : ', e)
  }
}

// Récupérer tous les projets depuis Firestore
export const getProjects = async () => {
  const querySnapshot = await getDocs(collection(db, 'projects'))
  const projects = []
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() })
  })
  return projects
}

// Supprimer un projet depuis Firestore
export const deleteProjectFromFirestore = async (id) => {
  try {
    const docRef = doc(db, 'projects', id)
    await deleteDoc(docRef)
    console.log('Projet supprimé avec l\'ID : ', id)
  } catch (e) {
    console.error('Erreur lors de la suppression du projet : ', e)
  }
}
import { updateDoc } from 'firebase/firestore'

export const updateProjectInFirestore = async (id, updatedProject) => {
  try {
    const docRef = doc(db, 'projects', id)
    await updateDoc(docRef, updatedProject)
    console.log('Projet mis à jour avec succès : ', id)
  } catch (e) {
    console.error('Erreur lors de la mise à jour : ', e)
  }
}
// Fonction pour récupérer les compétences
export const getCompetences = async () => {
    try {
      const competencesSnapshot = await getDocs(collection(db, "competences"));
      const competencesList = competencesSnapshot.docs.map(doc => doc.data());
      return competencesList;
    } catch (error) {
      console.error("Error getting competences: ", error);
      return [];
    }
  };
  // Fonction pour ajouter une compétence
export const addCompetenceToFirestore = async (competence) => {
    try {
      const docRef = await addDoc(collection(db, "competences"), competence);
      console.log('Compétence ajoutée avec l\'ID : ', docRef.id);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la compétence : ", error);
    }
  };
  
  // Fonction pour modifier une compétence
  export const updateCompetenceInFirestore = async (id, competence) => {
    try {
      const docRef = doc(db, "competences", id);
      await updateDoc(docRef, competence);
      console.log('Compétence mise à jour avec l\'ID : ', id);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la compétence : ", error);
    }
  };