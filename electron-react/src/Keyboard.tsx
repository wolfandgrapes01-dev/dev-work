
import 'react-simple-keyboard/build/css/index.css'
import japanese from 'simple-keyboard-layouts/build/layouts/japanese'
import KeyboardReact from 'react-simple-keyboard'
import { useRef, useState } from 'react';
import type { KeyboardLayoutObject, KeyboardReactInterface } from 'react-simple-keyboard'


const Keyboard = () => {
  const numric: KeyboardLayoutObject = {
    default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 _", "{bksp}"],
    shift: ["! / #", "$ % ^", "& * (", "{shift} ) +", "{bksp}"]
  };
  const theme = "hg-theme-default hg-layout-numeric numeric-theme"
  
  const [input, setInput] = useState("Hello nigga");
  const [layout, setLayout] = useState<KeyboardLayoutObject>(japanese.layout)
  const [layoutName, setLayoutName] = useState<"default" | "shift">("default")
  const keyboardRef = useRef<KeyboardReactInterface | null>(null)


  const onChange = (input: string) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setInput(input);
    keyboardRef.current?.setInput(input); // 物理キーボードの入力をVitural Keyboardに同期
    console.log("Input from device: ", input);
  };

  return (
    <div className="App">
      <input
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={onChangeInput}
      />
      <KeyboardReact
        // Vitural Keyboardの初期値とInputに一致する
        onInit={(keyboardInstance) => {
          keyboardInstance.setInput(input)
        }}
        keyboardRef={r => (keyboardRef.current = r)}  // 物理キーボードの入力をVitural Keyboardに同期
        layout={layout}
        layoutName={layoutName}
        theme={theme}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export default Keyboard;