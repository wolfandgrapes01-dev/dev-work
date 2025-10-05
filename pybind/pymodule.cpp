#include <pybind11/pybind11.h>
#include "MySingleton.h"

namespace py = pybind11;

PYBIND11_MODULE(pumodule, m)
{
    py::class_<MySingleton>(m, "MySingleton")
        .def_static("getInstance", &MySingleton::getInstance,
                    py::return_value_policy::reference) // 正确的 Singleton
        .def_static("getInstanceCopy", &MySingleton::getInstance,
                    py::return_value_policy::copy) // 故意返回拷贝做对照
        .def("hello", &MySingleton::hello)
        .def("addr", [](MySingleton &self)
             { return reinterpret_cast<uintptr_t>(&self); }); // 返回底层 C++ 实例地址
}