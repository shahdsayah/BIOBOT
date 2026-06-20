import axios from "axios";

export async function getForms() {
  const querySnapshot = await getDocs(collection(db, "forms"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createForm(formData) {
  return addDoc(collection(db, "forms"), formData);
}