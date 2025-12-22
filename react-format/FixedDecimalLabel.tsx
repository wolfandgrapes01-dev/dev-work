import { useState, forwardRef, useImperativeHandle } from "react";

// format 类型 union
type FormatType = "U" | "1f" | "4f" | "str";

type FixedDecimalLabelProps = {
    format?: FormatType;              // 可选，默认 str
    onChange?: (v: string) => void;   // 值变化回调
};

export type FixedDecimalLabelRef = {
    setValue: (v: string | number) => void;
    getValue: () => string;
};

const FixedDecimalLabel = forwardRef<FixedDecimalLabelRef, FixedDecimalLabelProps>(
    ({ format = "str", onChange }, ref) => {
        const [text, setText] = useState("");

        const formatValue = (v: string | number) => {
            // str 模式下数字报错
            if (format === "str") {
                const num = Number(v);
                if (!isNaN(num)) {
                    throw new Error(
                        "数字不能在 format=str 模式下显示，请指定具体 format"
                    );
                }
                return String(v);
            }

            // 非 str 模式必须是数字
            const num = Number(v);
            if (isNaN(num)) return String(v);

            switch (format) {
                case "U":
                    return Math.round(num).toString();
                case "1f":
                    return num.toFixed(1);
                case "4f":
                    return num.toFixed(4);
                default:
                    return String(v);
            }
        };

        useImperativeHandle(ref, () => ({
            setValue: (v: string | number) => {
                const formatted = formatValue(v);
                setText(formatted);
                onChange?.(formatted); // 调用回调
            },
            getValue: () => text,
        }));

        return <span>{text}</span>;
    }
);

export default FixedDecimalLabel;











import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from "react";

export type FixedDecimalLabelRef = {
  getValue: () => string;
  setValue: (v: string) => void;
};

type Props = {
  value?: string;           // 🔥 controlled
  defaultValue?: string;    // 🔥 uncontrolled 初始值
  format?: string;
  onChange?: (v: string) => void;
};

const FixedDecimalLabel = forwardRef<FixedDecimalLabelRef, Props>(
  ({ value, defaultValue = "", format, onChange }, ref) => {

    // 是否受控
    const isControlled = value !== undefined;

    // 内部状态（仅 uncontrolled 用）
    const [inner, setInner] = useState(defaultValue);

    const realValue = isControlled ? value! : inner;

    // 🔥 受控模式下，父 value 改变，组件自然重新渲染，不需额外 useEffect

    function setValue(v: string) {
      if (isControlled) {
        // 受控 → 只能通知父组件
        onChange?.(v);
      } else {
        // 非受控 → 内部改
        setInner(v);
        onChange?.(v);
      }
    }

    useImperativeHandle(ref, () => ({
      getValue: () => realValue,
      setValue
    }));

    return (
      <label>
        {applyFormat(realValue, format)}
      </label>
    );
  }
);

export default FixedDecimalLabel;


// ======= 示例格式函数 ========
function applyFormat(v: string, format?: string) {
  if (!format) return v;

  if (format === "U") return v.toUpperCase();

  if (format.endsWith("f")) {
    const n = Number(v);
    if (isNaN(n)) return v;
    const digits = Number(format[0]) || 0;
    return n.toFixed(digits);
  }

  return v;
}