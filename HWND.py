import winmsg
import ctypes
import threading
from time import sleep

hwnd = winmsg.create_window(ctypes.windll.kernel32.GetModuleHandleW(None))

def on_message(val):
    print("收到消息:", val)

winmsg.register_callback(on_message)

# 消息循环需要在后台线程运行
def message_loop():
    import ctypes.wintypes as wintypes
    user32 = ctypes.windll.user32
    msg = wintypes.MSG()
    while user32.GetMessageW(ctypes.byref(msg), 0, 0, 0) != 0:
        user32.TranslateMessage(ctypes.byref(msg))
        user32.DispatchMessageW(ctypes.byref(msg))

threading.Thread(target=message_loop, daemon=True).start()

# 模拟发送消息
import time
time.sleep(1)
ctypes.windll.user32.PostMessageW(hwnd, 0x400+100, 123, 0)
time.sleep(1)