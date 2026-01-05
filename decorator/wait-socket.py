def wait_socket(func):
    def wrapper(*args, **kwargs):
        fut = Future()
        key = func(fut, *args, **kwargs)

        with lock:
            pending[key] = fut

        try:
            return fut.result()   # 无限期等待
        finally:
            with lock:
                pending.pop(key, None)

    return wrapper