from concurrent.futures import Future, TimeoutError

pending = {}

def wait_socket(timeout=5):
    def decorator(func):
        def wrapper(*args, **kwargs):
            fut = Future()

            # 业务函数负责生成 key
            key = func(fut, *args, **kwargs)

            pending[key] = fut

            try:
                # 阻塞等待 socket
                return fut.result(timeout=timeout)

            except TimeoutError:
                pending.pop(key, None)
                raise   # 直接抛给业务层

        return wrapper
    return decorator