from flask import Flask, Response
import queue
import json
from enum import Enum
import threading
import time

# ===============================
# 定义事件类型 Enum
# ===============================
class EventType(Enum):
    FOO = "fooEvent"
    BAR = "barEvent"
    # 可以在这里添加更多事件类型

# ===============================
# 初始化 Flask 和消息队列
# ===============================
app = Flask(__name__)
message_queue = queue.Queue()  # 队列用于存放待发送的 SSE 消息

# ===============================
# 统一发送消息函数
# ===============================
def send_message(event_name: EventType, data: dict):
    """
    向 SSE 队列发送一条消息。
    
    Args:
        event_name (EventType): 消息类型，必须是 EventType Enum。
        data (dict): 消息内容，必须是字典，可被 JSON 序列化。
    """
    if not isinstance(data, dict):
        raise ValueError("data 必须是字典类型")
    
    # 可以在此添加额外字段，例如时间戳
    data_to_send = dict(data)
    data_to_send["timestamp"] = time.time()
    
    # 将消息放入队列，格式为 (event_name, data_dict)
    message_queue.put((event_name.value, data_to_send))
    print(f"[send_message] {event_name.value} -> {data_to_send}")

# ===============================
# SSE 生成器
# ===============================
def sse_generator():
    """
    从消息队列获取消息并生成 SSE 流。
    """
    try:
        while True:
            # 阻塞等待新的消息
            event_name, data = message_queue.get()
            # 按 SSE 格式发送
            yield f"event: {event_name}\n"
            yield f"data: {json.dumps(data)}\n\n"
    except GeneratorExit:
        # 客户端断开连接时会触发 GeneratorExit
        print("客户端断开连接，SSE 生成器退出")

# ===============================
# Flask SSE 路由
# ===============================
@app.route("/stream_queue")
def stream_queue():
    """
    SSE endpoint，浏览器连接后保持长连接接收消息。
    """
    return Response(sse_generator(), mimetype="text/event-stream")

# ===============================
# 启动 Flask
# ===============================
if __name__ == "__main__":
    app.run(threaded=True, port=5000)