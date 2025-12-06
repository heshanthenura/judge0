import NavBar from "@/app/components/NavBar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <NavBar />
      profile
    </div>
  );
}
