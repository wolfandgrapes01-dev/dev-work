import { createBrowserRouter, redirect } from "react-router-dom";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import { http } from "../lib/http";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Page1 />,
  },
  {
    path: "/page2/:id",
    // loader: async ({ params }) => {
    //   const { data } = await http.get(`/page2/${params.id}`);
    //   return data;
    // },
    loader: async ({ params }) => {
      try {
        const { data } = await http.get(`/page2/${params.id}`);
        return data;
      } catch (e) {
        throw redirect("/");
      }
    },
    element: <Page2 />,
  },
]);
