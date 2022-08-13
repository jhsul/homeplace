import { FunctionComponent, useRef, useState } from "react";

const Login: FunctionComponent = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!nameRef.current || !passRef.current) {
      console.error("Bad refs");
      return;
    }

    console.log("Logging in");

    const body = {
      name: nameRef.current.value,
      pass: passRef.current.value,
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
  };
  return (
    <div className="login">
      <b>name</b>
      <input ref={nameRef} type="text" />

      <b>password</b>
      <input ref={passRef} type="password" />

      {error && <p className="text-danger">{error}</p>}

      <button onClick={handleSubmit}>Log In</button>
    </div>
  );
};

export default Login;
