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
  
  export const updateProjectInFirestore = async (id, updatedProject) => {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, updatedProject)
      console.log('Projet mis à jour avec succès : ', id)
    } catch (e) {
      console.error('Erreur lors de la mise à jour : ', e)
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


// Fonction pour récupérer les compétences
export const getCompetences = async () => {
    const snapshot = await getDocs(collection(db, "competences"))
    const competences = snapshot.docs.map(doc => ({
      id: doc.id,         // 👈 récupérer l'id du document Firestore
      ...doc.data()        // 👈 récupérer les données
    }))
    return competences
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


  export const deleteCompetenceFromFirestore = async (id) => {
  const docRef = doc(db, 'competences', id)
  await deleteDoc(docRef)
}



  // Ajouter un projet à Firestore
export const addObjectifToFirestore = async (objectif) => {
  try {
    const docRef = await addDoc(collection(db, 'objectifs'), objectif)
    console.log('Document ajouté avec l\'ID : ', docRef.id)
  } catch (e) {
    console.error("Erreur lors de l\'ajout de l'objectif : ", e)
  }
}

// Récupérer tous les projets depuis Firestore
export const getObjectifs = async () => {
  const querySnapshot = await getDocs(collection(db, 'objectifs'))
  const objectifs = []
  querySnapshot.forEach((doc) => {
    objectifs.push({ id: doc.id, ...doc.data() })
  })
  return objectifs
}

// Supprimer un projet depuis Firestore
export const deleteObjectifFromFirestore = async (id) => {
  try {
    const docRef = doc(db, 'objectifs', id)
    await deleteDoc(docRef)
    console.log('Objet supprimé avec l\'ID : ', id)
  } catch (e) {
    console.error('Erreur lors de la suppression du projet : ', e)
  }
}


export const updateObjectifInFirestore = async (id, updatedobjectif) => {
  try {
    const docRef = doc(db, 'objectifs', id)
    await updateDoc(docRef, updatedobjectif)
    console.log('Objectif mis à jour avec succès : ', id)
  } catch (e) {
    console.error('Erreur lors de la mise à jour : ', e)
  }
}