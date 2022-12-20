import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Bussines } from "../components/Bussines";
import Header from "../components/Header";
import { Search } from "../components/Search";
import { Restaurants } from "../components/Restaurants";
import JoinUs from "../components/ JoinUs";
import { Restaurant } from "../utils/types";

type Props = {
  currentUser: any;
  signOut: () => void;
};
function HomePage({ currentUser, signOut }: Props) {
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
      <JoinUs />
    </div>
  );
}

export default HomePage;
