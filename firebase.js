
import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "XXXXXX",
    authDomain: "XXXXX",
    projectId: "XXXXX",
    storageBucket: "XXXX",
    messagingSenderId: "21815515898",
    appId: "1:2XXXXXX",
    measurementId: "G-XXXX"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
