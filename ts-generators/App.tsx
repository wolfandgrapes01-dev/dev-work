import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { _04C0AEA8_CB6D_4F4B_A1A9_EF3FC850958D_COVER_PNG, _1000_F_282106605_U_HHVB_Z5_PBH0_P2I5NBD_GM79_XL6A23_SEY_D_JPG, _1_COMPRESSED_JPG, _2_1_PNG, _40A2F548_D887_4D8F_B70A_A77ACE7923A1_COVER_PNG, _4169893_JPG, _8DDA41D092CB15E825D46A1B38F46110_JPG, GRADIENT_DARK_MODE_APP_TEMPLATE_52683_118055_AVIF, IMG_2662_PNG, IMG_2663_PNG, IMG_2865_PNG, IMG_2870_PNG, IMG_532_CB255_FFAC_1_JPEG, IMG_CAB0634_A3_EC0_1_JPEG, IOS_APP_DESIGN_SELF_CARE_PNG, MICROSOFT_TEAMS_IMAGE_73_COMPRESSED_1_JPG_WEBP, ORIGINAL_F6BBB62DD22B4F3E0F5F48CCAAF3F3B3_WEBP, PODCAST_APP_1_WEBP, THE_UNKNOWING_JPG, TRAVEL_MOBILE_APP_JPG, UI_UX_S_PNG, UNNAMED_WEBP } from "./publicPaths";

function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>页面固定区域</h1>

      {/* 任意 UI，只要能触发事件 */}
      <div>
        <button onClick={() => navigate("a")}>A</button>
        <button onClick={() => navigate("b")}>B</button>
        <button onClick={() => navigate("c")}>C</button>
      </div>

      {/* 👇 只有这里会切换 */}
      <div
        style={{
          border: "1px solid #000",
          marginTop: 12,
          padding: 12,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

function A() {
  return <div>内容 A<img src={_8DDA41D092CB15E825D46A1B38F46110_JPG} />
    <img src={ORIGINAL_F6BBB62DD22B4F3E0F5F48CCAAF3F3B3_WEBP} />
    <img src={THE_UNKNOWING_JPG} />
    <img src={_04C0AEA8_CB6D_4F4B_A1A9_EF3FC850958D_COVER_PNG} />
    <img src={GRADIENT_DARK_MODE_APP_TEMPLATE_52683_118055_AVIF} />
    <img src={_2_1_PNG} />
    <img src={_4169893_JPG} />
    <img src={TRAVEL_MOBILE_APP_JPG} />
    <img src={_1_COMPRESSED_JPG} />
    <img src={MICROSOFT_TEAMS_IMAGE_73_COMPRESSED_1_JPG_WEBP} />
    <img src={UNNAMED_WEBP} />
    <img src={IOS_APP_DESIGN_SELF_CARE_PNG} />
    <img src={_1000_F_282106605_U_HHVB_Z5_PBH0_P2I5NBD_GM79_XL6A23_SEY_D_JPG} />
    <img src={IMG_2663_PNG} />
    <img src={IMG_2662_PNG} />
    <img src={IMG_2870_PNG} />
    <img src={IMG_532_CB255_FFAC_1_JPEG} />
    <img src={IMG_2865_PNG} />
    <img src={UI_UX_S_PNG} />
    <img src={PODCAST_APP_1_WEBP} />
    <img src={IMG_CAB0634_A3_EC0_1_JPEG} />
    <img src={UI_UX_S_PNG} />
    <img src={UNNAMED_WEBP} />
    <img src={_40A2F548_D887_4D8F_B70A_A77ACE7923A1_COVER_PNG} />
  </div>
}

function B() {
  return <div>内容 B</div>;
}

function C() {
  return <div>内容 C</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/page/c" replace />} />

      <Route path="/page" element={<Layout />}>
        <Route path="a" element={<A />} />
        <Route path="b" element={<B />} />
        <Route path="c" element={<C />} />
      </Route>
    </Routes>
  );
}