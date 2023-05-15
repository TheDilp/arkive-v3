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

export function FolderSkeleton() {
  return (
    <div className="flex h-full flex-1 flex-wrap content-start gap-4 overflow-auto">
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="h-24 w-40 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}
