from pymodule import MySingleton

def show_instance(label, obj):
    print(f"{label} -> "
          f"Python id: {id(obj)} | hex: {hex(id(obj))} | "
          f"C++ addr: {hex(obj.addr())} | hello(): {obj.hello()}")

print("在 test2.py 中调用 getInstance()")
s_other = MySingleton.getInstance()
show_instance("s_other", s_other)