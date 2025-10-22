class Child:
    def __init__(self, name: str):
        self.name: str = name

    def greet(self):
        print(f"Hello, I am {self.name}")


class MySingleton:
    # 类私有变量
    __instance: "MySingleton" | None = None

    # 实例私有变量（类型注解，不允许 None）
    __counter: int
    __child: Child

    def __new__(cls):
        if cls.__instance is None:
            cls.__instance = super().__new__(cls)
            # -------- 在 __new__ 中初始化实例变量 --------
            cls.__instance.__counter = 0
            cls.__instance.__child = Child("Alice")
            print("MySingleton initialized")
        return cls.__instance

    @classmethod
    def getInstance(cls):
        if cls.__instance is None:
            cls.__instance = MySingleton()
        return cls.__instance

    # 示例方法操作私有变量
    def increment(self):
        self.__counter += 1

    def show_counter(self):
        print(f"counter = {self.__counter}")

    def show_child(self):
        self.__child.greet()