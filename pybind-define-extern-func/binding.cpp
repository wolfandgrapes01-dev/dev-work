#include <pybind11/pybind11.h>
#include "shlogger.h"

namespace py = pybind11;

// 宏展开生成函数
SH_EXECUTION_LOG(pyLogHello, "Hello from Macro")

PYBIND11_MODULE(example, m)
{
    // 绑定宏生成的函数
    m.def("py_log_hello", &pyLogHello, "Call macro-generated log function");
}