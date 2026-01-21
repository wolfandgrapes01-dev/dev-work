import { useRef, useState } from "react";
import "./App.css";
import Keyboard, { type KeyboardHandle } from "./components/Keyboard";
import InputWithClear from "./components/InputWithClear";

const App = () => {
  const [input, setInput] = useState("HELLO");
  const keyboardRef = useRef<KeyboardHandle>(null);

  const handleClear = () => {
    keyboardRef.current?.clear();
  };
  const handleInputChange = (v: string) => {
    setInput(v);
  };

  console.log(input);

  return (
    <>
      <InputWithClear
        value={input}
        onChange={handleInputChange}
        onClear={handleClear}
      />
      <Keyboard
        ref={keyboardRef}
        value={input}
        onValueChange={(v) => {
          setInput(v);
          console.log("CALL BACK VALUE:", v);
        }}
        onKey={(k) => {
          console.log("CALL BACK KEY:", k);
          if (k == "{enter}") {
            console.log(input);
          }
        }}
      />
    </>
  );
};

export default App;
