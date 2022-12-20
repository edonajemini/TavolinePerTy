import React from "react";
import { MdFoodBank, MdOutlineModeComment, MdReviews } from "react-icons/md";

import { Restaurant, User } from "../utils/types";
import { AiFillStar, AiOutlineClockCircle, AiOutlineTag } from "react-icons/ai";

import { BiBuildings } from "react-icons/bi";
import { ImSpoonKnife } from "react-icons/im";
import { TfiBell } from "react-icons/tfi";
import { GiTravelDress } from "react-icons/gi";
import { RiParkingBoxLine } from "react-icons/ri";
import { MdPayment } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";

type Props = {
  restaurant: Restaurant;
  currentUser: User | null;
};

function Description({ restaurant, currentUser }: Props) {
  const [readMore, setReadMore] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    fetch(`http://localhost:3005/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    //date should be in this format: 28/10/2022
    // const date = (event.currentTarget.date.value as string).split("-").reverse().join("/");
    //time should be in this format: 5:30 PM
    //@ts-ignore
    const date = event.target.date.value;
    //@ts-ignore
    const time = event.target.time.value;

    let finalDate = date.split("-").reverse().join("/");

    for (let reservation of restaurant.reservations) {
      if (reservation.date === finalDate && reservation.time === time) {
        toast.error(
          "This time is already reserved. Please pick a different time."
        );
        return;
      }
    }
    const reservation = {
      date: finalDate,
      time: time,
      restaurantId: restaurant.id,
      userId: currentUser!.id,
    };

    fetch(
      `http://localhost:3005/reservation/${reservation.userId}/${reservation.restaurantId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // toast.success("Reservation successful!");
      });

    console.log(reservation);
    toast.success("Reservation made successfully!");
  }

  return (
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
              <h1>{restaurant.name}</h1>
              <div className="icons-container">
                <div className="icons-row ">
                  <MdOutlineModeComment />
                  <span>
                    {restaurant.reviews.length}{" "}
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
                    ? restaurant.description.slice(0, 30)
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
              <h2>
                {restaurant.images.length}{" "}
                {restaurant.images.length === 1 ? "Photo" : "Photos"}
              </h2>
              <div className="description-photos-map">
                {restaurant.images.map((image) => (
                  <div key={image.id}>
                    <img key={image.id} src={image.url} alt="restaurant" />
                  </div>
                ))}
              </div>
            </div>
            <div id="description-reviews">
              <h2>
                { restaurant.reviews.length === 0 ? 
                "No reviews, be the first to review this restaurant!"
                :
                `What ${restaurant.reviews.length}
                ${restaurant.reviews.length === 1
                  ? "person is saying"
                  : "people are saying"}
                `}
              </h2>
              {currentUser?.role.toLowerCase() === "user" ? (
                <form
                  className="review-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetch(`http://localhost:3005/user/reviews`, {
                      method: "POST",
                      headers: {
                        Authorization: localStorage.token,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        review: e.target.text.value,
                        rating: Number(e.target.rating.value),
                        restaurantId: restaurant.id,
                      }),
                    })
                      .then((rsp) => rsp.json())
                      .then((data) => {
                        if (data.errors) {
                          alert(data.errors);
                        } else {
                          restaurant.reviews.push(data);
                        }
                      });
                  }}
                >
                  <h2>Leave a Review</h2>
                  <label>
                    {" "}
                    Rating
                    <select name="rating" id="">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </label>
                  <label>
                    Review
                    <textarea
                      name="content"
                      id="text"
                      placeholder="Your Review?"
                      required
                      rows={5}
                    ></textarea>
                  </label>
                  <button>POST</button>
                </form>
              ) : null}
              <div className="reviews">
                {users.map((user) =>
                  restaurant.reviews
                    .filter((review) => user.id === review.userId)
                    .reverse()
                    .map((review) => (
                      <div key={review.id} className="review">
                        <div className="review-user">
                          <div className="review-user-img">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p>{user.name}</p>
                          <div className="review-user-reviews">
                            <MdOutlineModeComment />
                            <p>
                              {user.reviews.length}{" "}
                              {user.reviews.length === 1 ? "review" : "reviews"}
                            </p>
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
        <aside className="right-side">
          <div className="right-side-container">
            <form
              className="right-side-reservation"
              onSubmit={currentUser 
                ? 
                (event) => handleSubmit(event)
                 : 
                  (event) => {
                    event.preventDefault();
                    navigate("/signin")
                  }
              }
            >
              <h2>Make a reservation</h2>
              <label>
                Party Size{" "}
                <select name="party-size" id="party-size">
                  {Array(20)
                    .fill(0)
                    .map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1} {index === 0 ? "person" : "people"}
                      </option>
                    ))}
                </select>
              </label>
              <div className="date-and-time">
                <label>
                  Date{" "}
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </label>
                <label>
                  Time
                  <select id="time" name="time" required>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                </label>
              </div>
              <button type="submit">Find a time</button>
            </form>
            {restaurant.iFrame ? (
              <div className="right-side-map">
                <div
                  className="the-map"
                  dangerouslySetInnerHTML={{ __html: restaurant.iFrame }}
                />
              </div>
            ) : null}
            <div className="right-side-additional">
              <h2>Additional information</h2>
              <div className="right-side-additional-item">
                <BiBuildings />
                <div>
                  <span className="p-item">Neighborhood</span>
                  <p>{restaurant.address}</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <AiOutlineClockCircle />
                <div>
                  <span className="p-item">Hours of operation</span>
                  <p>{restaurant.workHours}</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <ImSpoonKnife />
                <div>
                  <span className="p-item">Cuisines</span>
                  <p>{restaurant.cuisineInfo}</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <TfiBell />
                <div>
                  <span className="p-item">Dining style</span>
                  <p>{restaurant.diningStyle}</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <GiTravelDress />
                <div>
                  <span className="p-item">Dress code</span>
                  <p>{restaurant.dressCode}</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <RiParkingBoxLine />
                <div>
                  <span className="p-item">Parking details</span>
                  <p>None</p>
                </div>
              </div>
              <div className="right-side-additional-item">
                <MdPayment />
                <div>
                  <span className="p-item">Payment options</span>
                  <p>{restaurant.priceInfo}</p>
                </div>
              </div>
              <div className="right-side-additional-item last-item">
                <AiOutlineTag className="dev" />
                <div>
                  <span className="p-item">Additionals</span>
                  <p>{restaurant.additional}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <ToastContainer />
    </main>
  );
}

export default Description;
