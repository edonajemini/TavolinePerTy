import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Bussines } from "../components/Bussines";
import Description from "../components/Description";
import Header from "../components/Header";
import { Restaurant, User } from "../utils/types";
import { ProfilePage } from "./ProfilePage";
import "./RestaurantDetails.css";

type Props = {
  currentUser: User | null;
  signOut: () => void;
};

function RestaurantDetails({ currentUser, signOut }: Props) {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setInterval(() => {
      fetch(`http://localhost:3005/restaurants/${params.id}`)
        .then((res) => res.json())
        .then((result) => {
          setRestaurant(result);
        });
    }, 1000);
  }, []);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Bussines />
      <Header currentUser={currentUser} signOut={signOut} />
      {currentUser && currentUser.role.toLowerCase() === "admin" ? (
        <ProfilePage currentUser={currentUser} signOut={signOut} />
      ) : (
        <Description currentUser={currentUser} restaurant={restaurant} />
      )}
    </>
  );
}

export default RestaurantDetails;
