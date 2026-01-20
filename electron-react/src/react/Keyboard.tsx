import "react-simple-keyboard/build/css/index.css";
import japanese from "simple-keyboard-layouts/build/layouts/japanese";
import KeyboardReact from "react-simple-keyboard";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { KeyboardReactInterface } from "react-simple-keyboard";

export type KeyboardHandle = {
  clear: () => void;
};

type KeyboardProps = {
  value: string;
  onValueChange?: (val: string) => void;
  onKey?: (key: string) => void;
};

const Keyboard = forwardRef<KeyboardHandle, KeyboardProps>(
  ({ value, onValueChange, onKey }, ref) => {
    // const numric: KeyboardLayoutObject = {
    //   default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 _", "{bksp}"],
    //   shift: ["! / #", "$ % ^", "& * (", "{shift} ) +", "{bksp}"]
    // };
    const theme = "hg-theme-default hg-layout-numeric numeric-theme";

    // const [layout, setLayout] = useState<KeyboardLayoutObject>(japanese.layout)
    const [layoutName, setLayoutName] = useState<"default" | "shift">(
      "default"
    );
    const keyboardRef = useRef<KeyboardReactInterface | null>(null);

    useEffect(() => {
      keyboardRef.current?.setInput(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
      clear() {
        onValueChange?.("");
        keyboardRef.current?.clearInput();
      },
    }));

    const handleShift = () => {
      const newLayoutName = layoutName === "default" ? "shift" : "default";
      setLayoutName(newLayoutName);
    };

    const onChange = (input: string) => {
      if (onValueChange) {
        onValueChange(input);
      }
    };

    const onKeyPress = (button: string) => {
      if (onKey) {
        onKey(button);
      }

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") handleShift();
    };

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      keyboardRef.current?.setInput(input); // 物理キーボードの入力をVitural Keyboardに同期
      console.log("Input from device: ", input);
    };

    return (
      <div className="App">
        <KeyboardReact
          keyboardRef={(r) => (keyboardRef.current = r)} // 物理キーボードの入力をVitural Keyboardに同期
          layout={japanese.layout}
          layoutName={layoutName}
          theme={theme}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    );
  }
);

export default Keyboard;
