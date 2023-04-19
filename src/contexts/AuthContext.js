import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// create context
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [docId, setDocId] = useState(null);
  const [userId, setUserId] = useState(null);

  const clearUserData = () => {
    setImageAsset(null);
    setUserName("");
    setEmail("");
    setNumber("");
    setAddress("");
  };

  // signUp
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // login
  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logOut
  const logOut = () => {
    clearUserData();
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        logIn,
        logOut,
        userName,
        setUserName,
        email,
        setEmail,
        number,
        setNumber,
        address,
        setAddress,
        imageAsset,
        setImageAsset,
        docId,
        setDocId,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
