// Firebase Auth functions
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { app } from "@/lib/firebase/config";
import {
  logout,
  setError,
  setGoogleLoading,
  setLoading,
  setUser,
  User,
} from "../Redux/localSlices/authSlice";
import store from "../Redux/store";
import { toast } from "sonner";
import { TFunction } from "../../../global";
import { clearLibrary } from "../Redux/localSlices/librarySlice";

const auth = getAuth(app);

// Helper function to safely access error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred.";
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    store.dispatch(setLoading(true));
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const updatedUser = sanitizeFirebaseUser(
      userCredential.user as unknown as User,
    );
    store.dispatch(setUser(updatedUser));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    store.dispatch(setError(errorMessage));
    console.error("Error signing in with email:", errorMessage);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    store.dispatch(setGoogleLoading(true));
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // store tokken in cookies
    const idToken = await userCredential.user.getIdToken();
    const sessionRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!sessionRes.ok) {
      throw new Error("Session creation failed");
    }

    const updatedUser = sanitizeFirebaseUser(
      userCredential.user as unknown as User,
    );

    store.dispatch(setUser(updatedUser));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    store.dispatch(setError(errorMessage));
    console.error("Error signing in with Google:", errorMessage);
  } finally {
    store.dispatch(setGoogleLoading(false));
  }
};

// Sign Up with Email/Password
export const signUpWithEmail = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });

    const updatedUser = sanitizeFirebaseUser(
      auth.currentUser as unknown as User,
    );
    if (updatedUser) {
      store.dispatch(setUser(updatedUser));
    }
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
    } else {
      throw new Error(error.message);
    }
  }
};

// Sign Out
export const signOutUser = async (t?: TFunction) => {
  try {
    const deleteCookie = await fetch("/api/auth/session", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!deleteCookie.ok) {
      throw new Error("Failed to delete session cookie");
    }
    store.dispatch(setLoading(true));
    await signOut(auth);
    if (t) toast.success(t("LogOutSuccess"));
    store.dispatch(logout()); // Clear user in Redux
    store.dispatch(clearLibrary());
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    store.dispatch(setError(errorMessage));
    console.error("Error signing out:", errorMessage);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Listen for Auth Changes
export const listenToAuthChanges = async () => {
  const res = await fetch("/api/auth/check-auth");
  const { isAuthenticated } = await res.json();

  if (!isAuthenticated) {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await signOutUser();
      store.dispatch(logout());
    }
    return () => {}; // Return a no-op function to avoid crash
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const sanitizedUser = sanitizeFirebaseUser(user as unknown as User);
      if (sanitizedUser) {
        store.dispatch(setUser(sanitizedUser));
      } else {
        store.dispatch(logout());
      }
    } else {
      store.dispatch(logout());
    }
  });

  return unsubscribe; // Return actual listener cleanup
};

export const sanitizeFirebaseUser = (user: User | null) => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    accessToken: user.accessToken,
    phoneNumber: user.phoneNumber,
    isAnonymous: user.isAnonymous,
    creationTime: user.metadata?.creationTime,
    lastSignInTime: user.metadata?.lastSignInTime,
  };
};
