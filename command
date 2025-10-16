cd cpp_module
mkdir build
cd build
cmake .. -A x64 -DCMAKE_BUILD_TYPE=Debug
cmake --build . --config Debug