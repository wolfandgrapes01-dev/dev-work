type InputWithClearProps = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
};

const InputWithClear = ({ value, onClear, onChange }: InputWithClearProps) => {
  console.log(value);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={value}
        placeholder="Tap on the virtual keyboard to start"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <button onClick={onClear}>Clear</button>
    </div>
  );
};

export default InputWithClear;
