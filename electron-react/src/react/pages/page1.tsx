import { useNavigate } from "react-router-dom";

export default function Page1() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Page 1</h1>
      <button onClick={() => navigate("/page2/123")}>Go to Page2</button>
    </div>
  );
}
