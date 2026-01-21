import { useLoaderData } from "react-router-dom";

type LoaderData = {
  id: string;
  title: string;
};

export default function Page2() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h1>Page 2</h1>
      <p>ID: {data.id}</p>
      <p>{data.title}</p>
    </div>
  );
}
