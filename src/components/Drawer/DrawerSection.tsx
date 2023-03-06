import DrawerSectionTitle from "./DrawerSectionTitle";

type Props = {
  children: JSX.Element | JSX.Element[] | null;
  title: string;
  subtitle?: string;
};

export default function DrawerSection({ children, title, subtitle }: Props) {
  return (
    <div className="flex flex-col overflow-hidden">
      <DrawerSectionTitle title={title} />
      {subtitle ? <span className="w-full text-xs text-zinc-400">{subtitle}</span> : null}
      {children}
    </div>
  );
}
