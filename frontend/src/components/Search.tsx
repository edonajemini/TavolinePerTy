import { DefaultContext } from "react-icons";
import { Restaurant } from "../utils/types";

type Props = {
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
};

export function Search({ setRestaurants }: Props) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let searchDate = event.target.date.value;
    let searchTime = event.target.time.value;
    let searchTerm = event.target.text.value;

    let finalDate = searchDate.split("-").reverse().join("/");

    console.log({ finalDate, searchTime, searchTerm });

    fetch(`http://localhost:3005/restaurants/search/${searchTerm}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setRestaurants(data);
          let filteredRestaurants: Restaurant[] = [];
          filteredRestaurants = data.filter((restaurant: Restaurant) => {
            return (
              restaurant.reservations.filter((reservation) => {
                return (
                  reservation.date === finalDate &&
                  reservation.time === searchTime
                );
              }).length === 0
            );
          });
          setRestaurants(filteredRestaurants);

          // console.log(filteredRestaurants);
        }
      });
  }

  return (
    <div className="search-table">
      <h1>Find your table for any occasion</h1>
      <form className="search-form" onSubmit={(event) => handleSubmit(event)}>
        <input
          required
          type="date"
          min={new Date().toISOString().split("T")[0]}
          name="date"
        ></input>
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
        <select id="people" name="people">
          <option value="1">1 person</option>
          <option value="2">2 people</option>
          <option value="3">3 people</option>
          <option value="4">4 people</option>
          <option value="5">5 people</option>
          <option value="6">6 people</option>
          <option value="7">7 people</option>
          <option value="7">8 people</option>
          <option value="7">9 people</option>
          <option value="7">10 people</option>
          <option value="7">Larger Party</option>
        </select>
        <input
          required
          placeholder="Location, Restaurant, or Cuisine"
          name="text"
        ></input>
        <button type="submit">Let's go</button>
      </form>
    </div>
  );
}
