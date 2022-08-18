import {
  FormEventHandler,
  FunctionComponent,
  useContext,
  useRef,
  useState,
} from "react";
import useUser from "../hooks/user";
import { AppStateContext } from "./App";

interface SignupProps {
  setIsSigningUp: (value: boolean) => void;
}

const Signup: FunctionComponent<SignupProps> = ({ setIsSigningUp }) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const { appState, setAppState } = useContext(AppStateContext);

  const { username: _, mutate } = useUser();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const username = nameRef.current?.value;
    const password = passRef.current?.value;
    const confirm = confirmRef.current?.value;

    if (!username || !password || !confirm) {
      setError("Bad refs");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    console.log("Sending signup request");
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status !== 200) {
      const { error } = await res.json();
      setError(error);
      return;
    }

    console.log("Signed up!");

    mutate({ username });
    setAppState((s) => ({ ...s, error: null }));
    setIsSigningUp(false);
  };
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="form-group">
        <b>Username:</b>
        <input ref={nameRef} className="form-control" type="text" autoFocus />
      </div>

      <div className="form-group">
        <b>Password:</b>
        <input ref={passRef} className="form-control" type="password" />
      </div>

      <div className="form-group">
        <b>Confirm Password:</b>
        <input ref={confirmRef} className="form-control" type="password" />
      </div>
      {error && <p className="text-danger">{error}</p>}

      <button type="submit" className="btn btn-primary my-2 me-2">
        Sign Up
      </button>

      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => {
          setIsSigningUp(false);
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default Signup;
