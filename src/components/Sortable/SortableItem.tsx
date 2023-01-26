import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  children: JSX.Element | JSX.Element[];
  title: string;
};
export default function SortableItem({ id, title, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      title,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} className="flex" style={style} {...attributes} {...listeners}>
      {children}
    </li>
  );
}
