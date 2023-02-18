export function ParentColumn<ItemType extends { parent: { title: string } }>({ parent }: ItemType) {
  return <div className="w-full">{parent?.title}</div>;
}
