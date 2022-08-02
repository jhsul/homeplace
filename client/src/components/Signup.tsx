import { FunctionComponent, useRef, useState } from "react";

const Signup: FunctionComponent = () => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const name = nameRef.current?.value;
    const password = passRef.current?.value;
    const confirm = confirmRef.current?.value;

    if (!name || !password || !confirm) {
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
      body: JSON.stringify({ name, password }),
    });

    if (res.status !== 200) {
      setError("Something went wrong");
      console.error(await res.json());
      return;
    }

    console.log("Signed up!");

    setError(null);
  };
  return (
    <div className="signup">
      <b>name</b>
      <input ref={nameRef} type="text" />

      <b>password</b>
      <input ref={passRef} type="password" />

      <b>confirm password</b>
      <input ref={confirmRef} type="password" />

      {error && <p>Error: {error}</p>}

      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
};

export default Signup;
