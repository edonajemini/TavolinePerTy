import React, { useEffect, useState } from "react";
import { Bussines } from "../components/Bussines";
import Header from "../components/Header";
import { Reservations } from "../components/Reservations";
import { Restaurants } from "../components/Restaurants";
import { Search } from "../components/Search";
import { Restaurant } from "../utils/types";
import "./LogedinPage.css";

type Props = {
  currentUser: any;
  signOut: () => void;
};

function LogedinPage({ currentUser, signOut }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  useEffect(() => {
    fetch("http://localhost:3005/restaurants")
      .then((rsp) => rsp.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setRestaurants(data);
        }
      });
  }, []);

  return (
    <div>
      <Bussines />
      <Header currentUser={currentUser} signOut={signOut} />
      <Search setRestaurants={setRestaurants} />
      <Restaurants restaurants={restaurants} currentUser={currentUser} />
      <Reservations />
    </div>
  );
}

export default LogedinPage;
