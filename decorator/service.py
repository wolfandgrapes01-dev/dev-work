def on_socket_response(key, data):
    with lock:
        fut = pending.pop(key, None)

    if fut and not fut.done():
        fut.set_result(data)