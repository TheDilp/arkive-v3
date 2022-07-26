import React from "react";

type Props = {};

export default function TableComponent({}: Props) {
  return (
    <div>
      <table>
        <thead>
          <th>1</th>
          <th>2</th>
          <th>3</th>
        </thead>
        <tbody>
          <tr>
            <td>a</td>
            <td>b</td>
            <td>c</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
