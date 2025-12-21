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