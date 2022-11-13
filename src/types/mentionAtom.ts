import React, { FC } from "react";
import { Literal } from "@remirror/core";
declare type MentionAtom = FC<{
  id: string;
  name: string;
  label: string;
  children: React.ReactElement<HTMLElement>;
}>;
export const createMentionAtomHandler = (
  overwriteAttrs?: Record<string, Literal>,
) => MentionAtom;
export {};
