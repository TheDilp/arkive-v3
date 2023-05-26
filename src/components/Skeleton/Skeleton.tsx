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
      <div className="col-span-1 hidden animate-pulse bg-zinc-800 lg:block" />
      <div className="col-span-4 h-48 animate-pulse rounded bg-zinc-800 lg:col-span-3" />
      <div className="col-span-4 h-64 animate-pulse rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse  rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
      <div className="col-span-4 h-64 animate-pulse rounded bg-zinc-800 md:col-span-2 lg:col-span-1" />
    </div>
  );
}

export function ScreenViewSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="h-10 w-44 min-w-[6rem] animate-pulse bg-zinc-800" />
      <div className="flex gap-x-2">
        <div className="flex w-[25rem] min-w-[25rem] max-w-[25rem] flex-col gap-y-1">
          <div className="mb-1 flex h-10 max-w-full animate-pulse items-center justify-between rounded bg-zinc-800 py-1 px-2" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
        </div>
        <div className="flex w-[25rem] min-w-[25rem] max-w-[25rem] flex-col gap-y-1">
          <div className="mb-1 flex h-10 max-w-full animate-pulse items-center justify-between rounded bg-zinc-800 py-1 px-2" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
        </div>
        <div className="flex w-[25rem] min-w-[25rem] max-w-[25rem] flex-col gap-y-1">
          <div className="mb-1 flex h-10 max-w-full animate-pulse items-center justify-between rounded bg-zinc-800 py-1 px-2" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
          <div className="h-[25rem] max-h-[25rem] min-h-[25rem] animate-pulse bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
      <div className="flex h-14 w-full items-center justify-center">
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-700" />
      </div>
    </>
  );
}
