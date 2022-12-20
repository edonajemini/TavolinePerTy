import { useNavigate } from "react-router-dom";
import { Restaurant } from "../utils/types";

type Props = {
  setSeeAvailableDates: React.Dispatch<React.SetStateAction<boolean>>;
  modalRestaurant: any;
  currentUser: any;
};
export function FindNextAvailable({
  setSeeAvailableDates,
  modalRestaurant,
  currentUser,
}: Props) {
  const navigate = useNavigate();

  function getStringFromDate(date: Date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[date.getDay()];
    let month = months[date.getMonth()];
    let dateNo = date.getDate();
    let year = date.getFullYear();

    return `${day}, ${month} ${dateNo}, ${year}`;
  }

  function dateIsAvailable(date: Date, time: String): boolean {
    let dateNo = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let finalDate = `${dateNo}/${month}/${year}`;

    let available = true;
    modalRestaurant.reservations.forEach((reservation: any) => {
      if (reservation.date === finalDate && reservation.time === time) {
        available = false;
      }
    });
    return available;
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    navigate(`/restaurants/${modalRestaurant.id}`);

    //   const reservation = {
    //     date: finalDate,
    //     time: time,
    //     restaurantId: restaurant.id,
    //     userId: currentUser!.id,
    //   };

    //   fetch(
    //     `http://localhost:3005/reservation/${reservation.userId}/${reservation.restaurantId}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(reservation),
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((data) => {
    //       toast.success("Reservation successful!");
    //     });

    //   console.log(reservation);
    //   toast.success("Reservation made successfully!");
  }

  return (
    <div className="available-dates-modal__wrapper">
      <div className="available-dates-modal__container">
        <div className="modal__top">
          <h1 className="modal__restaurants-name">{modalRestaurant.name}</h1>
          <button
            className="modal__close-button"
            onClick={() => {
              setSeeAvailableDates(false);
            }}
          >
            ✖
          </button>
        </div>
        <div className="modal__next-available-dates">
          <h2 className="next-available-dates__title"> Next available dates</h2>
          <div className="day">
            <h3 className="date">{getStringFromDate(new Date())}</h3>
            <div className="times">
              <button
                className={
                  dateIsAvailable(new Date(), "5:30 PM")
                    ? "time"
                    : "time unavailable"
                }
                value="5:30 PM"
                onClick={handleClick}
              >
                5:30 PM
              </button>
              <button
                value="6:00 PM"
                className={
                  dateIsAvailable(new Date(), "6:00 PM")
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:00 PM
              </button>
              <button
                value="6:30 PM"
                className={
                  dateIsAvailable(new Date(), "6:30 PM")
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:30 PM
              </button>
              <button
                value="7:00 PM"
                className={
                  dateIsAvailable(new Date(), "7:00 PM")
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:00 PM
              </button>
              <button
                value="7:30 PM"
                className={
                  dateIsAvailable(new Date(), "7:30 PM")
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:30 PM
              </button>
            </div>
          </div>
          <div className="day">
            <h3 className="date">
              {getStringFromDate(new Date(Date.now() + 3600 * 1000 * 24))}
            </h3>
            <div className="times">
              <button
                value="5:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 3600 * 1000 * 24),
                    "5:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                5:30 PM
              </button>
              <button
                value="6:00 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 3600 * 1000 * 24),
                    "6:00 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:00 PM
              </button>
              <button
                value="6:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 3600 * 1000 * 24),
                    "6:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:30 PM
              </button>
              <button
                value="7:00 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 3600 * 1000 * 24),
                    "7:00 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:00 PM
              </button>
              <button
                value="7:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 3600 * 1000 * 24),
                    "7:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:30 PM
              </button>
            </div>
          </div>{" "}
          <div className="day">
            <h3 className="date">
              {getStringFromDate(new Date(Date.now() + 2 * 3600 * 1000 * 24))}
            </h3>
            <div className="times">
              <button
                value="5:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 2 * 3600 * 1000 * 24),
                    "5:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                5:30 PM
              </button>
              <button
                value="6:00 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 2 * 3600 * 1000 * 24),
                    "6:00 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:00 PM
              </button>
              <button
                value="6:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 2 * 3600 * 1000 * 24),
                    "6:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                6:30 PM
              </button>
              <button
                value="7:00 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 2 * 3600 * 1000 * 24),
                    "7:00 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:00 PM
              </button>
              <button
                value="7:30 PM"
                className={
                  dateIsAvailable(
                    new Date(Date.now() + 2 * 3600 * 1000 * 24),
                    "7:30 PM"
                  )
                    ? "time"
                    : "time unavailable"
                }
                onClick={handleClick}
              >
                7:30 PM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
