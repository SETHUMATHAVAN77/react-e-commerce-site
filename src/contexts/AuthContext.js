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

let orderData = localStorage.getItem("orders")
  ? JSON.parse(localStorage.getItem("orders"))
  : [];

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [docId, setDocId] = useState(null);
  const [userId, setUserId] = useState(null);
  // order state
  const [orders, setOrders] = useState(orderData);
  const [orderTotal, setOrderTotal] = useState(0);

  // localstorage set item
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const clearUserData = () => {
    setImageAsset(null);
    setUserName("");
    setEmail("");
    setNumber("");
    setAddress("");
  };

  useEffect(() => {
    const orderTotal = orders.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.quantity;
    }, 0);
    setOrderTotal(orderTotal);
  }, [orders]);

  // signUp
  const signUp = (email, password) => {
    clearUserData();
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

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUp,
        logIn,
        logOut,
        user,
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
        orders,
        setOrders,
        orderTotal,
        setOrderTotal,
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
