import { DeepstreamClient } from "@deepstream/client";
import { useEffect, useState } from "react";

const client = new DeepstreamClient("localhost:6020");
client.login();
const record = client.record.getRecord("some-name");
export default function Test() {
  const [state, setState] = useState<any>();
  useEffect(() => {
    record.subscribe("some-name", (value) => console.log(value));
    record.subscribe("some-name", function (value) {
      console.log(value);
      setState(value);
    });
    return () => record.unsubscribe(() => console.log("unsubscribed"));
  }, []);

  return (
    <textarea
      onChange={(e) => {
        record.set("some-name", e.target.value);
      }}
      value={state}
    />
  );
}
