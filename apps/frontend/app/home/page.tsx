import { SomeType } from "@repo/shared";

export default function Home() {
  const b: SomeType = {};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="text-lg">here you can see all the moves</p>
    </div>
  );
}