include <pybind11/pybind11.h>
namespace py = pybind11;

// 引入每个 X-macro 文件
include "xmacro_output/shlogger_constants_list.h"
include "xmacro_output/network_constants_list.h"

PYBIND11_MODULE(example, m) {
    // -------------------- ShLogger 子模块 --------------------
    py::module shlogger = m.def_submodule("shlogger", "ShLogger constants");
    #define X(name, value) shlogger.attr(#name) = value;
    SHLOGGER_CONSTANTS_LIST  // 展开 X-macro
    #undef X

    // -------------------- Network 子模块 --------------------
    py::module network = m.def_submodule("network", "Network constants");
    #define X(name, value) network.attr(#name) = value;
    NETWORK_CONSTANTS_LIST  // 展开 X-macro
    #undef X
}