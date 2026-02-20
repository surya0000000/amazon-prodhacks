import { redirect } from "next/navigation";

export default function Home() {
  redirect("/search?q=oven%20under%20100");
}
