export function Reservations() {
  return (
    <div className="reservations">
      <h2>Here are all the Reservations for you!</h2>
      <ul className="reservations-list">
        <li>
          <h4 style={{ textAlign: "center", lineHeight: 5, padding: 10 }}>
            You have no upcoming reservations.
          </h4>
        </li>
      </ul>
    </div>
  );
}
