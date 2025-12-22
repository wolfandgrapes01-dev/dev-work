def on_socket_reply(key, data):
    fut = pending.pop(key, None)
    if fut:
        fut.set_result(data)