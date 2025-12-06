import LoginForm from "@/app/components/LoginForm";
import NavBar from "@/app/components/NavBar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const accessToken = (await cookies()).get("access_token")?.value;

  console.log(accessToken);

  if (accessToken) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col gap-[20px]">
      <NavBar />
      <LoginForm />
    </div>
  );
}
