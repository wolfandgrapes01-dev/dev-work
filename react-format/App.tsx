import { useRef, useState } from "react";
import FixedDecimalLabel from "./FixedDecimalLabel";
import type { FixedDecimalLabelRef } from "./FixedDecimalLabel";

export default function App() {
  const labelRef1f = useRef<FixedDecimalLabelRef>(null);
  const labelRefU = useRef<FixedDecimalLabelRef>(null);
  const labelRef4f = useRef<FixedDecimalLabelRef>(null);
  const labelRefstr = useRef<FixedDecimalLabelRef>(null);

  // 用于实时显示
  const [currentValues, setCurrentValues] = useState({
    label1f: "",
    labelU: "",
    label4f: "",
    labelStr: "",
  });

  console.log("App render"); // ✅ 每次 App render 都会打印

  // 更新当前显示值
  const handleChange = (key: keyof typeof currentValues, v: string) => {
    setCurrentValues((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <div style={{ fontSize: 20 }}>
      <div>
        Soft Keyboard Input：
        <input
          placeholder="输入数字或文字"
          onChange={(e) => {
            const val = e.target.value;
            labelRef4f.current?.setValue(val);
            labelRefU.current?.setValue(val);
            labelRef1f.current?.setValue(val);
            labelRefstr.current?.setValue(val);
          }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        Label 4f：
        <FixedDecimalLabel
          ref={labelRef4f}
          format="4f"
          onChange={(v) => handleChange("label4f", v)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        Label U：
        <FixedDecimalLabel
          ref={labelRefU}
          format="U"
          onChange={(v) => handleChange("labelU", v)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        Label 1f：
        <FixedDecimalLabel
          ref={labelRef1f}
          format="1f"
          onChange={(v) => handleChange("label1f", v)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        Label str：
        <FixedDecimalLabel
          ref={labelRefstr}
          onChange={(v) => handleChange("labelStr", v)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        模拟按钮输入：
        <button
          onClick={() => {
            labelRef4f.current?.setValue("1");
            labelRefU.current?.setValue("1");
            labelRef1f.current?.setValue("1");
            labelRefstr.current?.setValue("1");
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            labelRef4f.current?.setValue("1.2");
            labelRefU.current?.setValue("1.2");
            labelRef1f.current?.setValue("1.2");
            labelRefstr.current?.setValue("1");
          }}
        >
          1.2
        </button>
        <button
          onClick={() => {
            labelRef4f.current?.setValue("abc");
            labelRefU.current?.setValue("abc");
            labelRef1f.current?.setValue("abc");
            labelRefstr.current?.setValue("abc");
          }}
        >
          abc
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            const val1 = labelRef1f.current?.getValue();
            const val2 = labelRef4f.current?.getValue();
            const val3 = labelRefU.current?.getValue();
            const val4 = labelRefstr.current?.getValue();

            alert(
              "Label1 当前值：" +
              val1 +
              " Label2 当前值：" +
              val2 +
              " Label3 当前值：" +
              val3 +
              " Label4 当前值：" +
              val4
            );
          }}
        >
          获取 Label 当前值
        </button>
      </div>

      {/* 实时显示 div */}
      <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
        <strong>实时显示:</strong>
        <div>Label 4f: {currentValues.label4f}</div>
        <div>Label U: {currentValues.labelU}</div>
        <div>Label 1f: {currentValues.label1f}</div>
        <div>Label str: {currentValues.labelStr}</div>
      </div>
    </div>
  );
}