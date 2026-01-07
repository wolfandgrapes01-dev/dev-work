import {
    Routes,
    Route,
    Outlet,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

import {
    _04C0AEA8_CB6D_4F4B_A1A9_EF3FC850958D_COVER_PNG,
    _1000_F_282106605_U_HHVB_Z5_PBH0_P2I5NBD_GM79_XL6A23_SEY_D_JPG,
    _1_COMPRESSED_JPG,
    _2_1_PNG,
    _40A2F548_D887_4D8F_B70A_A77ACE7923A1_COVER_PNG,
    _4169893_JPG,
    _8DDA41D092CB15E825D46A1B38F46110_JPG,
    GRADIENT_DARK_MODE_APP_TEMPLATE_52683_118055_AVIF,
    IMG_2662_PNG,
    IMG_2663_PNG,
    IMG_2865_PNG,
    IMG_2870_PNG,
    IMG_532_CB255_FFAC_1_JPEG,
    IMG_CAB0634_A3_EC0_1_JPEG,
    IOS_APP_DESIGN_SELF_CARE_PNG,
    MICROSOFT_TEAMS_IMAGE_73_COMPRESSED_1_JPG_WEBP,
    ORIGINAL_F6BBB62DD22B4F3E0F5F48CCAAF3F3B3_WEBP,
    PODCAST_APP_1_WEBP,
    THE_UNKNOWING_JPG,
    TRAVEL_MOBILE_APP_JPG,
    UI_UX_S_PNG,
    UNNAMED_WEBP,
} from "./publicPaths";

/* =========================
   preload 工具函数
========================= */
function preloadImages(urls: string[]) {
    const start = performance.now();

    console.group("🖼️ Image Preload");

    let loaded = 0;

    const promises = urls.map((url) => {
        return new Promise<void>((resolve) => {
            const img = new Image();

            img.onload = () => {
                loaded++;
                console.log(`✅ loaded (${loaded}/${urls.length})`, url);
                resolve();
            };

            img.onerror = () => {
                console.warn(`❌ failed`, url);
                resolve();
            };

            img.src = url;
        });
    });

    return Promise.all(promises).then(() => {
        const end = performance.now();
        const cost = Math.round(end - start);

        console.groupEnd();
        console.log(
            `%c🧠 preload finished: ${urls.length} images, ${cost} ms`,
            "color: #4caf50; font-weight: bold;"
        );

        return cost;
    });
}

/* =========================
   Layout（关键点：在这里 preload）
========================= */

function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        preloadImages([
            _04C0AEA8_CB6D_4F4B_A1A9_EF3FC850958D_COVER_PNG,
            _1000_F_282106605_U_HHVB_Z5_PBH0_P2I5NBD_GM79_XL6A23_SEY_D_JPG,
            _1_COMPRESSED_JPG,
            _2_1_PNG,
            _40A2F548_D887_4D8F_B70A_A77ACE7923A1_COVER_PNG,
            _4169893_JPG,
            _8DDA41D092CB15E825D46A1B38F46110_JPG,
            GRADIENT_DARK_MODE_APP_TEMPLATE_52683_118055_AVIF,
            IMG_2662_PNG,
            IMG_2663_PNG,
            IMG_2865_PNG,
            IMG_2870_PNG,
            IMG_532_CB255_FFAC_1_JPEG,
            IMG_CAB0634_A3_EC0_1_JPEG,
            IOS_APP_DESIGN_SELF_CARE_PNG,
            MICROSOFT_TEAMS_IMAGE_73_COMPRESSED_1_JPG_WEBP,
            ORIGINAL_F6BBB62DD22B4F3E0F5F48CCAAF3F3B3_WEBP,
            PODCAST_APP_1_WEBP,
            THE_UNKNOWING_JPG,
            TRAVEL_MOBILE_APP_JPG,
            UI_UX_S_PNG,
            UNNAMED_WEBP,
        ]);
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <h1>页面固定区域</h1>

            <div style={{ marginBottom: 12 }}>
                <button onClick={() => navigate("a")}>A</button>
                <button onClick={() => navigate("b")}>B</button>
                <button onClick={() => navigate("c")}>C</button>
            </div>

            <div
                style={{
                    border: "1px solid #000",
                    padding: 12,
                }}
            >
                <Outlet />
            </div>
        </div>
    );
}

/* =========================
   Background Image 组件
========================= */

type BgImageProps = {
    src: string;
};

const BgImage: React.FC<BgImageProps> = ({ src }) => {
    return (
        <div
            style={{
                width: 200,
                height: 140,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: 6,
            }}
        />
    );
};

/* =========================
   Page A
========================= */

function A() {
    const images = [
        _8DDA41D092CB15E825D46A1B38F46110_JPG,
        ORIGINAL_F6BBB62DD22B4F3E0F5F48CCAAF3F3B3_WEBP,
        THE_UNKNOWING_JPG,
        _04C0AEA8_CB6D_4F4B_A1A9_EF3FC850958D_COVER_PNG,
        GRADIENT_DARK_MODE_APP_TEMPLATE_52683_118055_AVIF,
        _2_1_PNG,
        _4169893_JPG,
        TRAVEL_MOBILE_APP_JPG,
        _1_COMPRESSED_JPG,
        MICROSOFT_TEAMS_IMAGE_73_COMPRESSED_1_JPG_WEBP,
        UNNAMED_WEBP,
        IOS_APP_DESIGN_SELF_CARE_PNG,
        _1000_F_282106605_U_HHVB_Z5_PBH0_P2I5NBD_GM79_XL6A23_SEY_D_JPG,
        IMG_2663_PNG,
        IMG_2662_PNG,
        IMG_2870_PNG,
        IMG_532_CB255_FFAC_1_JPEG,
        IMG_2865_PNG,
        UI_UX_S_PNG,
        PODCAST_APP_1_WEBP,
        IMG_CAB0634_A3_EC0_1_JPEG,
        _40A2F548_D887_4D8F_B70A_A77ACE7923A1_COVER_PNG,
    ];

    return (
        <div>
            <h2>内容 A（background-image）</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, 200px)",
                    gap: 12,
                }}
            >
                {images.map((src, i) => (
                    <BgImage key={i} src={src} />
                ))}
            </div>
        </div>
    );
}

/* =========================
   Page B / C
========================= */

function B() {
    return <div>内容 B</div>;
}

function C() {
    return <div>内容 C</div>;
}

/* =========================
   App
========================= */

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