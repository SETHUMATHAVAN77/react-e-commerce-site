import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// pages
import { Home, Category, Cart } from "./pages/index";
// components
import { Provider } from "react-redux";
import store from "./store/store";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserInfo from "./pages/UserInfo";
import AddProfile from "./pages/AddProfile";
import Error from "./components/Error/Error";
// user context
import { UserAuth } from "./contexts/AuthContext";
// firebase
import { db } from "./utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const App = () => {
  const {
    user,
    setUserName,
    setImageAsset,
    setEmail,
    setNumber,
    setAddress,
    setDocId,
    setUserId,
  } = UserAuth();

  // getting user profile
  const fetchUserDetails = async () => {
    if (user && user?.uid) {
      const q = query(
        collection(db, "userInfo"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.docs.map((doc) => {
        setDocId(doc.id);
        const userData = doc.data();
        if (userData) {
          setUserId(userData.userId);
          setUserName(userData.userName);
          setImageAsset(userData.image);
          setEmail(userData.email);
          setNumber(userData.number);
          setAddress(userData.address);
        }
        return doc.id;
      });
    }
  };
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={<Home fetchUserDetails={fetchUserDetails} />}
            />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/userinfo/:id"
              element={<UserInfo fetchUserDetails={fetchUserDetails} />}
            />
            <Route path="/addprofile" element={<AddProfile />} />
            <Route path="/editprofile/:id" element={<AddProfile />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
