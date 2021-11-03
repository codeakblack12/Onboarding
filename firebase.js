/*/ Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import * as firebase from 'firebase';
import '@firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt9A4vZUXpQbdW_gfQQluFZ6aTRf1qZd4",
  authDomain: "onboard-29fbe.firebaseapp.com",
  projectId: "onboard-29fbe",
  storageBucket: "onboard-29fbe.appspot.com",
  messagingSenderId: "21815515898",
  appId: "1:21815515898:web:6e2e6338be28739f180743",
  measurementId: "G-R1K86HFJ9X"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export default firebase;

//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
*/
import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDt9A4vZUXpQbdW_gfQQluFZ6aTRf1qZd4",
    authDomain: "onboard-29fbe.firebaseapp.com",
    projectId: "onboard-29fbe",
    storageBucket: "onboard-29fbe.appspot.com",
    messagingSenderId: "21815515898",
    appId: "1:21815515898:web:6e2e6338be28739f180743",
    measurementId: "G-R1K86HFJ9X"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();