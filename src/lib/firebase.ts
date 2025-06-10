import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuração do Firebase - Delícias da Di
const firebaseConfig = {
  apiKey: "AIzaSyAYM6ddTvIN4CrjECPmwT0Y18pojvmAz70",
  authDomain: "deliciasdadi-734da.firebaseapp.com",
  projectId: "deliciasdadi-734da",
  storageBucket: "deliciasdadi-734da.firebasestorage.app",
  messagingSenderId: "434325082476",
  appId: "1:434325082476:web:63975d79b2474414f4e349"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Para desenvolvimento local, você pode usar o emulador (opcional)
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app; 