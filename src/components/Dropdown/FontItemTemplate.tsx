export function FontItemTemplate(item: { label: string; value: string }) {
  const { value, label } = item;
  return <div style={{ fontFamily: value }}>{label}</div>;
}
