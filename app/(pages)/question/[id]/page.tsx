import NavBar from "@/app/components/NavBar";
import QuestionForm from "@/app/components/QuestionForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuestionPage(props: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const accessToken = (await cookies()).get("access_token")?.value;

  const params = await props.params;
  const id = params.id;

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div>
      <NavBar />
      <QuestionForm id={id} />
    </div>
  );
}
