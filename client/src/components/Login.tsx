import { FormEventHandler, FunctionComponent, useRef, useState } from "react";
import useUser from "../hooks/user";

interface LoginProps {
  setIsLoggingIn: (value: boolean) => void;
}

const Login: FunctionComponent<LoginProps> = ({ setIsLoggingIn }) => {
  const { username, mutate } = useUser();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!nameRef.current || !passRef.current) {
      console.error("Bad refs");
      return;
    }

    console.log("Logging in");

    const body = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status !== 200) {
      setError(data.error);
      return;
    }

    console.log("Logged in");

    mutate({ username: body.username });
    setIsLoggingIn(false);
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
      {error && <p className="text-danger">{error}</p>}

      <button type="submit" className="btn btn-primary my-2 me-2">
        Log In
      </button>

      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => {
          setIsLoggingIn(false);
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default Login;
