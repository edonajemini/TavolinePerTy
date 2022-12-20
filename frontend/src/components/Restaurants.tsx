import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import stars from "../assets/stars.png";
import { Restaurant } from "../utils/types";
import { FindNextAvailable } from "./FindNextAvailable";

type Props = {
  restaurants: Restaurant[];
  currentUser: any;
};

export function Restaurants({ restaurants, currentUser }: Props) {
  const [seeAvailableDates, setSeeAvailableDates] = useState(false);
  const [modalRestaurant, setModalRestaurant] = useState<Restaurant>();

  return (
    <>
      <h2 className="restaurant-h2">Popular restaurants </h2>
      <div className="restaurants-feed">
        {restaurants.map((restaurant) => (
          <>
            <div key={restaurant.id} className="restaurant-feed-item">
              <Link to={`/restaurants/${restaurant.id}`}>
                <img src={restaurant.profileImg} width="250px" height="135px" />
              </Link>
              <Link to={`/restaurants/${restaurant.id}`}>
                <div className="restaurant-content">
                  <h3>{restaurant.name}</h3>
                  <div className="rating">
                    <img src={stars} width="100px" height="20px" />{" "}
                    <h5>{restaurant.reviews.length} reviews</h5>
                  </div>
                  <p>
                    {restaurant.cuisineInfo} • {restaurant.priceInfo} •{" "}
                    {restaurant.city}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => {
                  setModalRestaurant(restaurant);
                  setSeeAvailableDates(true);
                }}
              >
                Find next available
              </button>
            </div>
            {seeAvailableDates ? (
              <FindNextAvailable
                setSeeAvailableDates={setSeeAvailableDates}
                modalRestaurant={modalRestaurant}
                currentUser={currentUser}
              />
            ) : null}
          </>
        ))}
      </div>
    </>
  );
}
