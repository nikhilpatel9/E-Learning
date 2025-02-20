
import { getAuth, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
 

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Custom sign in function with proper error handling
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return {
      success: true,
      user: {
        name: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL
      }
    };
  } catch (error) {
    console.error("Google Sign In Error:", error);
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Please allow popups for this website to use Google sign in');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign in cancelled');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in cancelled');
    } else {
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  }
};