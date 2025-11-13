import React, { useEffect, useState } from "react";

// 定义事件数据类型
interface FooEventData {
  foo: number;
  timestamp: number;
}

interface BarEventData {
  bar: number;
  timestamp: number;
}



const SSEDemo: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        // 这里硬编码 Flask 的 SSE 地址
        const source = new EventSource("http://127.0.0.1:5000/stream");

        // 默认事件（无类型）
        source.onmessage = (e: MessageEvent) => {
            console.log("Received:", e.data);
            setMessages((prev) => [...prev, `Received: ${e.data}`]);
        };

// 监听 fooEvent
source.addEventListener("fooEvent", (e: MessageEvent) => {
  const msg: FooEventData = JSON.parse(e.data);
  console.log("fooEvent:", msg);
});

// 监听 barEvent
source.addEventListener("barEvent", (e: MessageEvent) => {
  const msg: BarEventData = JSON.parse(e.data);
  console.log("barEvent:", msg);
});

        // 连接关闭时打印信息
        source.onerror = (err) => {
            console.error("SSE connection error:", err);
            try {
                source.close();
                console.log("SSE connection closed cleanly.");
            } catch (e) {
                console.warn("Error closing SSE:", e);
            }
        };

        // 组件卸载时关闭 SSE 连接
        return () => {
            try {
                source.close();
                console.log("SSE connection closed cleanly.");
            } catch (e) {
                console.warn("Error closing SSE:", e);
            }
        };
    }, []);

    const sendHello = async () => {
        try {
            // 直接访问 Flask 的 /hello 路由
            await fetch("http://127.0.0.1:5000/hello");
            console.log("Sent /hello");
        } catch (err) {
            console.error("Failed to send /hello:", err);
        }
    };

    return (
        <div
            style={{
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                background: "#f8f9fa",
                color: "#333",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <img style={{
                width: "80%",
                maxWidth: "500px",
                height: "300px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "white",
                padding: "10px",
                overflowY: "auto",
                fontFamily: "monospace",
            }} src="http://127.0.0.1:5000/video" alt="Live Stream" />
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Flask SSE Demo</h1>
            <div
                id="messages"
                style={{
                    width: "80%",
                    maxWidth: "500px",
                    height: "300px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "white",
                    padding: "10px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                }}
            >
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <button
                onClick={sendHello}
                style={{
                    marginTop: "1rem",
                    padding: "0.6rem 1.2rem",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Send Hello
            </button>
        </div>
    );
};

export default SSEDemo;