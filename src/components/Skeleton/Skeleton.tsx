export function ProjectCardSkeleton() {
  return (
    <div className="mx-2 flex h-[25rem] w-80 animate-pulse flex-col justify-between rounded-md border border-zinc-700 bg-zinc-800 text-center shadow-sm" />
  );
}

export function TreeSkeleton({ count = 1 }: { count?: number }) {
  return (
    <ul className="mt-4 flex flex-col gap-y-4">
      {[...Array(count)].map((n) => (
        <li key={(n ?? Math.random()) + 3} className="h-4 w-full animate-pulse rounded bg-zinc-800" />
      ))}
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

export function RandomTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-full animate-pulse rounded bg-zinc-700" />
      <div className="h-8 w-full animate-pulse rounded bg-zinc-700" />
    </div>
  );
}

export function ProjectViewSkeleton() {
  return (
    <div className="grid h-full w-full grid-cols-4 content-start gap-4 p-20">
      <div className="col-span-4 h-48 animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56 animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56  animate-pulse rounded bg-zinc-800" />
      <div className="col-span-1 h-56 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}
