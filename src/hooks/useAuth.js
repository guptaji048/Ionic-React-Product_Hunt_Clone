import React, { useState, useEffect } from "react";
import firebase from "../firebase";

function useAuth() {
  const [authUser, setauthUser] = useState(null);

  useEffect(() => {
    const unsub = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setauthUser(user);
      } else {
        setauthUser(null);
      }
    });
    return () => unsub();
  }, []);
  return [authUser, setauthUser];
}

export default useAuth;
