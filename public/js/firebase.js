// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyCGYohi2vKkHQr3avilOhzr2gU_S2eM5Hs",
  authDomain: "blogging-website-56341.firebaseapp.com",
  projectId: "blogging-website-56341",
  storageBucket: "blogging-website-56341.appspot.com",
  messagingSenderId: "901647404908",
  appId: "1:901647404908:web:22dd4ee39600286016ed49",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Khởi tạo database
let db = firebase.firestore();

// Khởi tạo auth
let auth = firebase.auth();

// logout
const logoutUser = () => {
  auth.signOut();
  location.reload();
};
