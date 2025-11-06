from flask import Flask, Response
from flask_cors import CORS
import cv2
import time
import threading

app = Flask(__name__)
CORS(app, supports_credentials=True)

camera = cv2.VideoCapture(0)
frame_lock = threading.Lock()
latest_frame = None

# 后台线程：持续读取摄像头
def camera_thread():
    global latest_frame
    while True:
        success, frame = camera.read()
        if success:
            with frame_lock:
                latest_frame = frame
        time.sleep(0.03)  # ~30fps

threading.Thread(target=camera_thread, daemon=True).start()

# 提供视频流
def generate_frames():
    while True:
        with frame_lock:
            if latest_frame is None:
                continue
            ret, buffer = cv2.imencode('.jpg', latest_frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        time.sleep(0.03)

@app.route('/video')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# SSE 流
@app.route('/stream')
def stream():
    def event_stream():
        count = 0
        while True:
            yield f"data: Current timestamp: {time.time()}\n\n"
            count += 1
            if count % 5 == 0:
                msg = f'{{"message": "Hello from Flask at {time.strftime("%H:%M:%S")}"}}'
                yield f"event: greeting\ndata: {msg}\n\n"
            time.sleep(1)
    return Response(event_stream(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(threaded=True, debug=True)