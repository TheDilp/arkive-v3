import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

export default function DrawerFullSearch() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5175/full_search/c6b7e599-5800-4eb9-921b-24e7725e11a3", {
      method: "POST",
      body: JSON.stringify({
        query: "men",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <div>
      <InputText onChange={(e) => setSearch(e.target.value)} value={search} />
    </div>
  );
}
