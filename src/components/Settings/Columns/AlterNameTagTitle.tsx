import { Tag } from "primereact/tag";

type Props = {
  title: string;
};

export default function AlterNameTagTitle({ title }: Props, type: "tag" | "alter_name") {
  return (
    <div className={type === "alter_name" ? "alter_namesTags" : ""}>
      <Tag className="" value={title} />
    </div>
  );
}
