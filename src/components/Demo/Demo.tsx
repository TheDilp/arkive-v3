import React, { useState } from "react";
import { documentDemo } from "../../utils/utils";
import PublicEditor from "../PublicView/Wiki/PublicEditor/PublicEditor";

type Props = {};

export default function Demo({}: Props) {
  const [demo, setDemo] = useState("Documents");
  return (
    <div className="w-full h-screen flex">
      <ul className="w-2 bg-green-200">
        <li>DOCUMENT EDTIOR</li>
        <li>MAPS</li>
        <li>BOARDS</li>
      </ul>
      <div className="w-10 bg-blue-500">
        {demo === "Documents" && (
          <PublicEditor content={documentDemo} classes="demo" editable={true} />
        )}
      </div>
    </div>
  );
}
