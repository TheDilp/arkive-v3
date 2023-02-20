type Props = {
  children: JSX.Element | JSX.Element[] | string | null;
};

export default function DefaultTooltip({ children }: Props) {
  return <div className="rounded border border-zinc-800 bg-black p-2 text-sm">{children}</div>;
}
