import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
// Add firebaseConfig data from your firebase project
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// const db = initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);

export { db, auth,storage };
export default firebase;
