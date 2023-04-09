import { getCookie } from "../storage";

export async function FetchFunction({
  url,
  method,
  body,
}: {
  url: string;
  method: "GET" | "POST" | "DELETE";
  body?: string | FormData;
}) {
  const token = getCookie("__session");
  const res = await fetch(url, {
    method,
    body,
    headers: {
      "Access-Control-Allow-Origin": "*",
      ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) {
    // @ts-ignore
    await window?.Clerk?.signOut();
  }
  if (!res.ok) {
    throw new Error("There was an error with this request (server error).");
  }
  const data = await res.json();
  if (data === false) throw new Error("There was an error with this request.");
  return data;
}
