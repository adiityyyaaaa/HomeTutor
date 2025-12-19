import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCCyAzI-yFOK_7qQ4jL3SYb9PaiM4HLOE0",
    authDomain: "hometutor-auth.firebaseapp.com",
    projectId: "hometutor-auth",
    storageBucket: "hometutor-auth.firebasestorage.app",
    messagingSenderId: "809150416954",
    appId: "1:809150416954:web:35c2f651b614aef8ac8d03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
