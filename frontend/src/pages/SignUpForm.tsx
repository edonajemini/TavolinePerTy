import { useNavigate } from "react-router-dom";
import * as API from "../api";
import JoinUs from "../components/ JoinUs";
import { Bussines } from "../components/Bussines";
import Header from "../components/Header";
import "./SignUpForm.css";

type Props = {
  currentUser: any;
    signOut: () => void;
  signIn: (data: { user: any; token: string }) => void;
};

export function SignUpForm({ signIn, currentUser, signOut}: Props) {
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;

    if (email && password && name) {
      API.signup({ email, password, name }).then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          //sign them in
          signIn(data);
          navigate("/logedin");
        }
      });
    }
  }

  return (
    <>
      <Bussines />
      <Header currentUser={currentUser} signOut={signOut} />
      <div className="signup-page">
        <JoinUs />
        <div className="sign-up-form-container">
          <h2>Create your account</h2>
          <h4>
            Signing up as <span> </span>
            <a href="/signin"> (not you?)</a>
          </h4>
          <form
            className="sign-up-form-section"
            onSubmit={(event) => handleSubmit(event)}
          >
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              id="name"
              required
            />
            <label htmlFor="name">Email</label>
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="email"
              required
            />
            <label htmlFor="password">
              Password <span>*</span> <br />
              <p>Use at least 8 characters</p>
            </label>

            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              required
            />

            <p>
              By creating an account or logging in, you understand and agree to
              <a href=""> Terms</a> and <a href=""> Conditions</a>. You also
              acknowledge our <a href="">Cookies</a> and <a href="">Privacy</a>{" "}
              policies.
            </p>

            <button className="sign-up-btn" type="submit">
              Create account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
