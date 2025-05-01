import { db } from '@/firebase/firebase.js'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'


// Ajouter un projet à Firestore
export const addProjectToFirestore = async (project) => {
  const auth = getAuth();
  const user = auth.currentUser;
      const docRef = await addDoc(collection(db, 'projects'), project)
      console.log('Document ajouté avec l\'ID : ', docRef.id)
    
      // 2. Ajouter une activité
  await addDoc(collection(db, 'activites'), {
    type: 'ajout',
    category: 'projet',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: project.title
    }
  })
  }
  
  export const updateProjectInFirestore = async (id, updatedProject) => {
    const auth = getAuth();
    const user = auth.currentUser;
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, updatedProject)
      console.log('Projet mis à jour avec succès : ', id)
    
    // 2. Ajouter une activité
  await addDoc(collection(db, 'activites'), {
    type: 'modification',
    category: 'projet',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: updatedProject.title
    }
  })
  }
  
  import { getAuth } from 'firebase/auth'
  import { query, where, orderBy, onSnapshot } from 'firebase/firestore'

// Récupérer tous les projets depuis Firestore
export const getProjects = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non connecté.');
  
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid)  // <-- Filtrer par userId
    )
  
    const querySnapshot = await getDocs(q)
    const projects = []
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() })
    })
    return projects
  }


// Supprimer un projet depuis Firestore
export const deleteProjectFromFirestore = async (project) => {
  const auth = getAuth();
  const user = auth.currentUser;
    const docRef = doc(db, 'projects', project.id)
    await deleteDoc(docRef)
    console.log('Projet supprimé avec l\'ID : ', project.id)
  
  await addDoc(collection(db, 'activites'), {
    type: 'supression',
    category: 'projet',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: project.title
    }
  })
}
import { updateDoc } from 'firebase/firestore'


// Fonction pour récupérer les compétences

export const getCompetences = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) throw new Error('Utilisateur non connecté.');
  
    const q = query(
      collection(db, "competences"), // ta collection Firestore
      where('userId', '==', user.uid) // 👈 filtre seulement les compétences de CE user
    );
  
    const snapshot = await getDocs(q);
  
    const competences = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    return competences;
  }
  // Fonction pour ajouter une compétence
export const addCompetenceToFirestore = async (competence) => {
  const auth = getAuth();
  const user = auth.currentUser;
      const docRef = await addDoc(collection(db, "competences"), competence);
      console.log('Compétence ajoutée avec l\'ID : ', docRef.id);
    
    await addDoc(collection(db, 'activites'), {
      type: 'ajout',
      category: 'competence',
      relatedId: docRef.id,
      userId: user.uid,
      date: serverTimestamp(),
      details: {
        titre: competence.name
      }
    })
  };
  
  
  // Fonction pour modifier une compétence
  export const updateCompetenceInFirestore = async (id, competence) => {
    const auth = getAuth();
    const user = auth.currentUser;
      const docRef = doc(db, "competences", id);
      await updateDoc(docRef, competence);
      console.log('Compétence mise à jour avec l\'ID : ', id);
    
    await addDoc(collection(db, 'activites'), {
      type: 'modification',
      category: 'competence',
      relatedId: docRef.id,
      userId: user.uid,
      date: serverTimestamp(),
      details: {
        titre: competence.name
      }
    })
  };


  export const deleteCompetenceFromFirestore = async (competence) => {
    const auth = getAuth();
  const user = auth.currentUser;
  const docRef = doc(db, 'competences', competence.id)
  await deleteDoc(docRef)

  await addDoc(collection(db, 'activites'), {
    type: 'supression',
    category: 'competence',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: competence.name
    }
  })
}



  // Ajouter un projet à Firestore
export const addObjectifToFirestore = async (objectif) => {
  const auth = getAuth();
  const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'objectifs'), objectif)
    console.log('Document ajouté avec l\'ID : ', docRef.id)
  
  await addDoc(collection(db, 'activites'), {
    type: 'ajout',
    category: 'objectif',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: objectif.title
    }
  })
}

// Récupérer tous les projets depuis Firestore

export const getObjectifs = async () => {
  // Get the current user
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error('Utilisateur non connecté.');

  // Create a query to get objectifs for the logged-in user
  const q = query(
    collection(db, 'objectifs'),
    where('userId', '==', user.uid)  // Filter by userId
  );

  const querySnapshot = await getDocs(q);
  const objectifs = [];
  
  querySnapshot.forEach((doc) => {
    objectifs.push({ id: doc.id, ...doc.data() });
  });
  
  return objectifs;
};

// Supprimer un projet depuis Firestore
export const deleteObjectifFromFirestore = async (objectif) => {
  const auth = getAuth();
  const user = auth.currentUser;
    const docRef = doc(db, 'objectifs', objectif.id)
    await deleteDoc(docRef)
    console.log('Objet supprimé avec l\'ID : ', objectif.id)

  await addDoc(collection(db, 'activites'), {
    type: 'supression',
    category: 'objectif',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: objectif.title
    }
  })
}


export const updateObjectifInFirestore = async (id, updatedobjectif) => {
  const auth = getAuth();
  const user = auth.currentUser;
    const docRef = doc(db, 'objectifs', id)
    await updateDoc(docRef, updatedobjectif)
    console.log('Objectif mis à jour avec succès : ', id)

  await addDoc(collection(db, 'activites'), {
    type: 'modification',
    category: 'objectif',
    relatedId: docRef.id,
    userId: user.uid,
    date: serverTimestamp(),
    details: {
      titre: updatedobjectif.title
    }
  })
}


export const listenToActivities = (callback) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error('Utilisateur non connecté.');

  const q = query(
    collection(db, 'activites'),
    where('userId', '==', user.uid),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    callback(activities);
  });
};