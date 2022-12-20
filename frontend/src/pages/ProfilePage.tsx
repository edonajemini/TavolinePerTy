import React, { useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { MdFoodBank, MdOutlineModeComment } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Bussines } from "../components/Bussines";
import Header from "../components/Header";
import "./ProfilePage.css";

import { Reservation, Restaurant, User } from "../utils/types";

type Props = {
  currentUser: User | null;
  signOut: () => void;
};
export function ProfilePage({ currentUser, signOut }: Props) {
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [readMore, setReadMore] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [isAddingImagge, setIsAddingImage] = React.useState(false);

  if (currentUser && !restaurant) {
    fetch(`http://localhost:3005/users/${currentUser.id}/restaurant`)
      .then((res) => res.json())
      .then((result) => {
        setRestaurant(result);
      });
  }

  React.useEffect(() => {
    if (currentUser) {
      fetch(
        `http://localhost:3005/restaurants/${currentUser.restaurants[0].id}/reservations`
      )
        .then((resp) => resp.json())
        .then((reservationsFromServer) =>
          setReservations(reservationsFromServer)
        );
    }
  }, []);

  if (!restaurant) return <div>Loading...</div>;

  if (currentUser === null) return <div>Loading...</div>;

  function handleUpdateNameSubmit(event) {
    event.preventDefault();

    fetch(`http://localhost:3005/restaurants/${restaurant.id}/patch`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: event.target.name.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setRestaurant(response);
        setIsEditingName(false);
      });
  }
  function handleAddImageSubmit(event) {
    event.preventDefault();

    fetch(`http://localhost:3005/image/${restaurant?.id}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        url: event.target.url.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        restaurant?.images.push(response)
        setIsAddingImage(false);
      });
  }

  function updateNameForm() {
    return (
      <form onSubmit={handleUpdateNameSubmit}>
        <input name="name" required defaultValue={restaurant.name} />

        <input type="submit" value="Update" />
      </form>
    );
  }
  function addImageForm() {
    return (
      <form onSubmit={handleAddImageSubmit}>
        <input name="url" required />

        <input type="submit" value="Add Image" />
      </form>
    );
  }
  return (
    <>
      <Bussines />
      <Header currentUser={currentUser} signOut={signOut} />
      <div className="user-profile">
        <div className="profile-image">{currentUser.name.charAt(0)}</div>
        <div className="user-profile-name">
          <h1>Manager: {currentUser.name}</h1>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <main className="main">
        <div className="main-image"></div>
        <div className="main-content">
          <aside className="left-side">
            <nav className="navigation-links">
              <div>
                <a href="#description-overview">Overview</a>
              </div>
              <div>
                <a href="#description-photos">Photos</a>
              </div>
              <div>
                <a href="#description-reviews">Reviews</a>
              </div>
            </nav>
            <section className="description">
              <div id="description-overview">
                {isEditingName ? updateNameForm() : <h1>{restaurant.name}</h1>}
                <button
                  className="addphotos-btn"
                  onClick={() => setIsEditingName(true)}
                >
                  Change name
                </button>
                <div className="icons-container">
                  <div className="icons-row ">
                    <MdOutlineModeComment />
                    <span>
                      {restaurant.reviews.length}
                      {restaurant.reviews.length === 1 ? "Review" : "Reviews"}
                    </span>
                  </div>
                  <div className="icons-row">
                    <MdFoodBank />
                    <span>{restaurant.cuisineInfo}</span>
                  </div>
                </div>
                <div className="description-text">
                  <p className="show-more-p">
                    {readMore
                      ? restaurant.description.slice(0, 20)
                      : restaurant.description}{" "}
                    {readMore ? "..." : null}{" "}
                    <span
                      onClick={() => {
                        setReadMore(!readMore);
                      }}
                      className="show-more"
                    >
                      {readMore ? "(read more)" : "(show less)"}
                    </span>
                  </p>
                </div>
              </div>
              <div id="description-photos">
                <div className="photos-btn">
                  <h2>
                    {restaurant.images.length}{" "}
                    {restaurant.images.length === 1 ? "Photo" : "Photos"}
                  </h2>
                  {isAddingImagge ? addImageForm() : null}
                  <button
                    className="addphotos-btn"
                    onClick={() => {
                      setIsAddingImage(true);
                    }}
                  >
                    Add Photos
                  </button>
                </div>
                <div className="description-photos-map">
                  {restaurant.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt="restaurant"
                      width={400}
                    />
                  ))}
                </div>
              </div>
              <div id="description-reviews">
                <h2>
                  What {restaurant.reviews.length}{" "}
                  {restaurant.reviews.length === 1
                    ? "person is saying"
                    : "people are saying"}
                </h2>
                <div className="reviews">
                  {users.map((user) =>
                    restaurant.reviews
                      .filter((review) => user.id === review.userId)
                      .map((review) => (
                        <div key={review.id} className="review">
                          <div className="review-user">
                            <div className="review-user-img">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <p>{user.name}</p>
                            <div className="review-user-reviews">
                              <MdOutlineModeComment />
                              <p>{user.reviews.length}</p>
                            </div>
                          </div>
                          <div className="review-rating">
                            <p>
                              {Array(review.rating).fill(
                                <AiFillStar className="review-stars" />
                              )}
                            </p>
                            <p>{review.review}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </section>
          </aside>
          <aside className="right-side-reservationn">
            <div className="right-sidee">
              <form className="reservations-feed">
                <h2>Reservations</h2>
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="reservations">
                    <div className="details">
                      <h3>Details</h3>
                      <h3>Date</h3>
                    </div>
                    <div className="reservation-content">
                      <div className="user-reservation">
                        <h4>Name: {reservation.claimedBy.name}</h4>
                        <p>Time: {reservation.time}</p>
                      </div>
                      <div className="date-reservation">
                        <p>{reservation.date}</p>
                        <button
                          className="reservation-delete"
                          onClick={(e) => {
                            e.preventDefault();
                            fetch(
                              `http://localhost:3005/reservation/${reservation.id}`,
                              {
                                method: "DELETE",
                              }
                            )
                              .then((rsp) => rsp.json())
                              .then((data) => console.log(data));
                            setReservations(
                              reservations.filter(
                                (currentReservation) =>
                                  currentReservation.id !== reservation.id
                              )
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* <div className="reservations">
                  <div className="details">
                    <h3>Details</h3>
                    <h3>Due</h3>
                  </div>
                  <div className="reservation-content">
                    <div className="user-reservation">
                      <h4>Name: Bob Sanders</h4>
                      <p>Time: 18:00</p>
                    </div>
                    <div className="date-reservation">
                      <p>Date:25.10.2022</p>
                      <button className="reservation-delete">Delete</button>
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
            <div></div>
          </aside>
        </div>
      </main>
    </>
  );
}
