export function ProjectCardSkeleton() {
  return (
    <div className="mx-2 flex h-[25rem] w-80 animate-pulse flex-col justify-between rounded-md border border-zinc-700 bg-zinc-800 text-center shadow-sm" />
  );
}

export function TreeSkeleton() {
  return (
    <ul className="mt-4 flex flex-col gap-y-4">
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      <li className="h-4 w-full animate-pulse rounded bg-zinc-800" />
    </ul>
  );
}
