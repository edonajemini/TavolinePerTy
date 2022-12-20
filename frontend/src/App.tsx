import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import * as API from "./api";
import HomePage from "./pages/HomePage";
import RestaurantDetails from "./pages/RestaurantDetails";
import LogedinPage from "./pages/LogedinPage";
import { SignInForm } from "./pages/SignInForm";
import { SignUpForm } from "./pages/SignUpForm";
import { PageNotFound } from "./pages/PageNotFound";
import { useState, useEffect } from "react";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  function signIn(data: { user: any; token: string }) {
    setCurrentUser(data.user);
    localStorage.token = data.token;
    if (data.user.role.toLowerCase() === "admin") navigate("/profile");
    else navigate("/logedin");
  }

  function signOut() {
    setCurrentUser(null);
    navigate("/homepage");
    localStorage.removeItem("token");
  }

  useEffect(() => {
    if (localStorage.token) {
      API.validate().then((data) => {
        if (data.error) {
          alert(data.error);
          localStorage.removeItem("token");
        } else {
          signIn(data);
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route index element={<Navigate to="/homepage" />} />
        <Route
          path="/homepage"
          element={<HomePage currentUser={currentUser} signOut={signOut} />}
        />
        <Route
          path="/logedin"
          element={<LogedinPage currentUser={currentUser} signOut={signOut} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage currentUser={currentUser} signOut={signOut} />}
        />
        <Route
          path="/signin"
          element={
            <SignInForm
              currentUser={currentUser}
              signOut={signOut}
              signIn={signIn}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpForm
              currentUser={currentUser}
              signOut={signOut}
              signIn={signIn}
            />
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <RestaurantDetails currentUser={currentUser} signOut={signOut} />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
