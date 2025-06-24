// Firebase Auth functions
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  logout,
  setError,
  setGoogleLoading,
  setLoading,
  setUser,
  setUserStatusLoading,
  User,
} from "../Redux/localSlices/authSlice";
import store from "../Redux/store";
import { toast } from "sonner";
import { TFunction } from "../../../global";
import { clearLibrary } from "../Redux/localSlices/librarySlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import firestoreApi from "../Redux/apiSlices/firestoreSlice";
import { auth } from "./config";

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
    console.error("Error signing in with email:", errorMessage);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Google Sign In
export const signInWithGoogle = async ({
  router,
  t,
}: {
  router: AppRouterInstance;
  t: TFunction;
}) => {
  try {
    store.dispatch(setGoogleLoading(true));
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const previousRoute = sessionStorage.getItem("previousRoute");
    router.push(previousRoute || "/");

    // store tokken in cookies
    const idToken = await userCredential.user.getIdToken();
    const sessionRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    document.cookie = "loggedOut=false; path=/;";

    if (!sessionRes.ok) {
      throw new Error("Session creation failed");
    }

    const updatedUser = sanitizeFirebaseUser(
      userCredential.user as unknown as User,
    );

    store.dispatch(setUser(updatedUser));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === "Firebase: Error (auth/popup-closed-by-user).") {
      store.dispatch(setError(t("ToastsOrMessages.PopupClosedByUser")));
    } else {
      store.dispatch(setError(errorMessage));
    }

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
    store.dispatch(setLoading(true));
    const deleteCookie = await fetch("/api/auth/session", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!deleteCookie.ok) {
      throw new Error("Failed to delete session cookie");
    }
    document.cookie = "loggedOut=true; path=/;";
    await signOut(auth);
    if (t) toast.success(t("LogOutSuccess"));
    store.dispatch(firestoreApi.util.resetApiState());
    store.dispatch(logout());
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
  store.dispatch(setUserStatusLoading(true));

  const res = await fetch("/api/auth/check-auth");
  const { isAuthenticated } = await res.json();

  console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    document.cookie = "loggedOut=true; path=/;";

    await signOutUser();

    store.dispatch(setUserStatusLoading(false));
    return () => {}; // No-op unsubscribe
  } else if (isAuthenticated) {
    const currentUser = auth.currentUser;
    console.log("currentUser", currentUser);
    if (currentUser) {
      const updatedUser = sanitizeFirebaseUser(currentUser as unknown as User);
      if (updatedUser) {
        store.dispatch(setUser(updatedUser));
      }
      document.cookie = "loggedOut=false; path=/;";
    } else if (!currentUser) {
      document.cookie = "loggedOut=true; path=/;";
      await signOutUser();
    }

    store.dispatch(setUserStatusLoading(false));
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      document.cookie = "loggedOut=false; path=/;";
      const sanitizedUser = sanitizeFirebaseUser(user as unknown as User);
      if (sanitizedUser) {
        const sessionRes = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: await user.getIdToken() }),
        });
        if (!sessionRes.ok) {
          throw new Error("Session creation failed");
        }
        store.dispatch(setUser(sanitizedUser));
      } else {
        store.dispatch(logout());
      }
    } else {
      document.cookie = "loggedOut=true; path=/;";
      await fetch("/api/auth/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      store.dispatch(logout());
      store.dispatch(clearLibrary());
      store.dispatch(firestoreApi.util.resetApiState());
    }
    store.dispatch(setUserStatusLoading(false));
  });

  return unsubscribe;
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
