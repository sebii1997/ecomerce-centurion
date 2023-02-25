import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyD-TbhYsQVIlpxiws4xcOW0E_HhDdMnK7k",
    authDomain: "ecommerce-web-b8501.firebaseapp.com",
    projectId: "ecommerce-web-b8501",
    storageBucket: "ecommerce-web-b8501.appspot.com",
    messagingSenderId: "594882852840",
    appId: "1:594882852840:web:161fbbc91b9f009752d65d",
    measurementId: "G-H1VWW7YB0B"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const auth = firebase.auth();
  const fs = firebaseApp.firestore();
  const storage = firebase.storage();

  export {auth, fs, storage}