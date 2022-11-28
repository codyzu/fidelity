// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// Import {getAnalytics} from 'firebase/analytics';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAqhlOCO9gP9V8yVbx46BwivlWHXADRJ4c',
  authDomain: 'fidelity-c4a86.firebaseapp.com',
  projectId: 'fidelity-c4a86',
  storageBucket: 'fidelity-c4a86.appspot.com',
  messagingSenderId: '99265203034',
  appId: '1:99265203034:web:10f89a858072f8d2268163',
  measurementId: 'G-5Q7K2RBYS6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
