export async function fetchQuestionsPreview() {
  const res = await fetch("/api/questions/preview");
  if (!res.ok) {
    throw new Error("Failed to fetch questions preview");
  }
  return res.json();
}
