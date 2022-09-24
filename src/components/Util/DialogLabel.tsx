import React from "react";

type Props = {
  text: string;
};

export default function DialogLabel({ text }: Props) {
  return <label className="w-full text-sm text-gray-400">{text}</label>;
}
