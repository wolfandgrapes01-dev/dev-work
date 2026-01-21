import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 说明
// 这里不加拦截器，保持最简
// 你以后可以在这里统一加 token / error 处理
