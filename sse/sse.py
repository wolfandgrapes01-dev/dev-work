message_queue = queue.Queue()

@app.route("/stream_queue")
def stream_queue():
    def gen():
        try:
            while True:
                msg = message_queue.get()  # 阻塞等待新数据
                yield f"data: {msg}\n\n"
        except GeneratorExit:
            print("客户端断开连接，线程结束")
    return Response(gen(), mimetype="text/event-stream")