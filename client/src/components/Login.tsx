import { FunctionComponent, useRef, useState } from "react";

const Login: FunctionComponent = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!nameRef.current || !passRef.current) {
      console.error("Bad refs");
      return;
    }

    console.log("Logging in");

    console.log({ name: nameRef.current, pass: passRef.current });
  };
  return (
    <div className="login">
      <b>name</b>
      <input ref={nameRef} type="text" />

      <b>password</b>
      <input ref={passRef} type="password" />

      <button onClick={handleSubmit}>Log In</button>
    </div>
  );
};

export default Login;
