export default function DayTitle({ index, weekdays }: { index: number; weekdays: string[] }) {
  if (index < 10)
    return (
      <span className="select-none font-Lato text-lg text-zinc-400 transition-colors hover:text-white">{weekdays[index]}</span>
    );
  return (
    <span className="select-none font-Lato text-lg text-zinc-400 transition-colors hover:text-white">
      {weekdays[index % weekdays.length || 0]}
    </span>
  );
}
