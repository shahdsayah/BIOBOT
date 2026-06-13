import axios from "axios";
//saves student data after signup.
export function createStudentProfile(userId, studentData) {
  return setDoc(doc(db, "students", userId), studentData);
}


//reads the student data from Firestore using the logged-in user ID.
export async function getStudentProfile(userId) {
  const docRef = doc(db, "students", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}