import { useEffect, useRef } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./components/Firebase"; // ensure this exports the shared `auth` instance

const useUserAuthenticator = () => {
  const navigate = useNavigate();
  const initializedRef = useRef(false);

  // ✅ Sets up auth state listener ONCE
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log("✅ Listening to onIdTokenChanged");

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      console.log("🎯 onIdTokenChanged:", user);

      if (user) {
        // Force token refresh immediately to detect invalid/deleted users
        user.getIdToken(true)
          .then(() => {
            console.log("🟢 Token valid. User is active.");
          })
          .catch((err) => {
            console.warn("❌ Immediate token refresh failed:", err);
            handleLogout();
          });
      } else {
        handleLogout();
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listener");
      unsubscribe();
    };
  }, [navigate]);

  // ✅ Periodic token revalidation every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const user = auth.currentUser;
      if (user) {
        console.log("⏱️ Periodic token check...");
        user.getIdToken(true).catch((err) => {
          console.warn("❌ Periodic token refresh failed:", err);
          handleLogout();
        });
      }
    }, 1 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          console.log("🔓 User signed out");
          navigate("/");
        })
        .catch((err) => {
          console.error("⚠️ Error during sign out:", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  };

  const clearSession = () => {
    console.log("🧼 Clearing session");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("super-admin-auth");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_image");
  };
};

export default useUserAuthenticator;
