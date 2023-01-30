import DrawerSectionTitle from "./DrawerSectionTitle";

type Props = {
  children: JSX.Element | JSX.Element[] | null;
  title: string;
};

export default function DrawerSection({ children, title }: Props) {
  return (
    <div className="flex flex-col">
      <DrawerSectionTitle title={title} />
      {children}
    </div>
  );
}
