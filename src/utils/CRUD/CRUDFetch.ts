import { getAuth } from "firebase/auth";

export async function FetchFunction({
  url,
  method,
  body,
}: {
  url: string;
  method: "GET" | "POST" | "DELETE";
  body?: string | FormData;
}) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(url, {
    method,
    body,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return new Error("There was an error with this request (server error).");
  }
  const data = await res.json();
  if (data === false) throw new Error("There was an error with this reques.");
  return data;
}
