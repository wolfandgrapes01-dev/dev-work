from flask import Flask, Response
import threading
import time
import queue
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)


# === 第一种：Event 推送 ===
latest_message = None
new_message_event = threading.Event()

@app.route("/stream")
def stream():
    """基于 threading.Event 的 SSE"""
    def gen():
        global latest_message
        while True:
            new_message_event.wait()  # 阻塞等待事件
            yield f"data: {latest_message}\n\n"
            new_message_event.clear()
    return Response(gen(), mimetype="text/event-stream")


def send_event_message(msg: str):
    """通过 Event 推送消息"""
    global latest_message
    latest_message = msg
    new_message_event.set()


# === 第二种：Queue 推送 ===
message_queue = queue.Queue()

@app.route("/stream_queue")
def stream_queue():
    """基于 queue.Queue 的 SSE"""
    def gen():
        while True:
            msg = message_queue.get()  # 阻塞等待新数据
            yield f"data: {msg}\n\n"
    return Response(gen(), mimetype="text/event-stream")


def send_queue_message(msg: str):
    """通过 Queue 推送消息"""
    message_queue.put(msg)


# === 模拟事件源 ===
def external_event_source_event():
    """测试 Event 推送"""
    for i in range(5):
        time.sleep(2)
        msg = f"[Event] 数据 {i}"
        send_event_message(msg)
        print(f"[Event SENT] {msg}")


def external_event_source_queue():
    """测试 Queue 推送"""
    for i in range(5):
        time.sleep(2)
        msg = f"[Queue] 数据 {i}"
        send_queue_message(msg)
        print(f"[Queue SENT] {msg}")


@app.route("/ping_event")
def ping_event():
    """启动 Event 推送线程"""
    external_event_source_event()
    # threading.Thread(target=external_event_source_event, daemon=True).start()
    return {"status": "event started"}


@app.route("/ping_queue")
def ping_queue():
    """启动 Queue 推送线程"""
    external_event_source_queue()
    # threading.Thread(target=external_event_source_queue, daemon=True).start()
    return {"status": "queue started"}


@app.route("/req")
def req():
    return {"status": "ok"}

threading.Thread(target=external_event_source_event, daemon=True).start()
threading.Thread(target=external_event_source_queue, daemon=True).start()


if __name__ == "__main__":
    app.run(threaded=True)

