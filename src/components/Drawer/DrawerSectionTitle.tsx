type Props = {
  title: string;
};

export default function DrawerSectionTitle({ title }: Props) {
  return <span className="w-full text-sm text-zinc-400">{title}</span>;
}
