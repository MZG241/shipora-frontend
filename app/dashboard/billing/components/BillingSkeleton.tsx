export function BillingSkeleton() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200" />

        <div className="h-4 w-80 animate-pulse rounded-md bg-zinc-100" />
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

                  <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
                </div>

                <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100" />
              </div>
            </div>
          ),
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {/* TABLE HEADER */}
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-28 animate-pulse rounded bg-zinc-200" />

            <div className="h-5 w-8 animate-pulse rounded-full bg-zinc-100" />
          </div>
        </div>

        {/* SEARCH */}
        <div className="border-b border-zinc-200 p-4">
          <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-zinc-100" />
        </div>

        {/* ROWS */}
        <div>
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex items-center gap-6 border-b border-zinc-100 px-6 py-5 last:border-0"
              >
                <div className="w-[20%] space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />

                  <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
                </div>

                <div className="w-[20%]">
                  <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
                </div>

                <div className="w-[20%]">
                  <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
                </div>

                <div className="w-[20%]">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-100" />
                </div>

                <div className="flex w-[20%] justify-end">
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-100" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}