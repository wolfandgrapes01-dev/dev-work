import {
    Routes,
    Route,
    Outlet,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { PUBLIC_IMAGES } from "./publicPaths";


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
   Layout（在这里 preload）
========================= */

let preloaded = false;

function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (preloaded) return;
        preloaded = true;

        preloadImages(PUBLIC_IMAGES);
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
    const images = PUBLIC_IMAGES;

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