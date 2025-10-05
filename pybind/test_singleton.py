from pymodule import MySingleton
import importlib.util, sys

def show_instance(label, obj):
    print(f"{label} -> "
          f"Python id: {id(obj)} | hex: {hex(id(obj))} | "
          f"C++ addr: {hex(obj.addr())} | hello(): {obj.hello()}")

# === 验证 1：多次调用 getInstance() ===
print("=== 验证 1：多次调用 getInstance() ===")
s1 = MySingleton.getInstance()
s2 = MySingleton.getInstance()
show_instance("s1", s1)
show_instance("s2", s2)
print("是否同一个 Python 对象:", s1 is s2)

# === 验证 2：Python 持有引用 ===
print("\n=== 验证 2：Python 持有引用 ===")
s3 = s1
show_instance("s3", s3)
print("s1 和 s3 是否同一个 Python 对象:", s1 is s3)

# === 验证 3：跨模块 import ===
print("\n=== 验证 3：跨模块 import ===")
spec = importlib.util.spec_from_file_location("test2", "test2.py")
test2 = importlib.util.module_from_spec(spec)
sys.modules["test2"] = test2
spec.loader.exec_module(test2)

# === 验证 4：严格意义上的 C++ 内存地址 ===
print("\n=== 验证 4：严格意义上的 C++ 内存地址 ===")
print("即使 Python id 不同，只要 C++ addr 一致，就说明是同一个 Singleton 实例")
s4 = MySingleton.getInstance()
s5 = MySingleton.getInstance()
show_instance("s4", s4)
show_instance("s5", s5)

# === 验证 5：错误 return policy 对照实验 (copy) ===
print("\n=== 验证 5：错误 return policy 对照实验 (copy) ===")
c1 = MySingleton.getInstanceCopy()
c2 = MySingleton.getInstanceCopy()
show_instance("c1 (copy)", c1)
show_instance("c2 (copy)", c2)
print("c1 和 c2 是否同一个 C++ 对象:", c1.addr() == c2.addr())