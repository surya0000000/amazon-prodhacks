interface SearchChromeProps {
  query: string;
}

export function SearchChrome({ query }: SearchChromeProps) {
  return (
    <header className="sticky top-0 z-40 w-full text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
      <div className="flex min-h-[60px] items-center gap-2 bg-[#131921] px-2 sm:px-3">
        <button
          type="button"
          className="group relative hidden min-h-10 min-w-[112px] items-center border border-transparent px-2 text-left hover:border-white sm:flex"
        >
          <div>
            <span className="block text-[26px] font-bold leading-none tracking-tight">amazon</span>
            <span className="mt-0.5 block text-[11px] font-semibold leading-none text-[#ff9900]">
              marketplace
            </span>
          </div>
          <span className="pointer-events-none absolute bottom-[5px] left-[20px] h-2 w-[66px] rounded-[100%] border-b-2 border-[#ff9900]" />
        </button>

        <button
          type="button"
          className="hidden min-h-10 min-w-[128px] border border-transparent px-2 text-left hover:border-white md:block"
        >
          <div className="text-[10px] leading-none text-[#ccc]">Deliver to</div>
          <div className="mt-1 text-[12px] font-semibold leading-none">San Francisco 94107</div>
        </button>

        <div className="flex h-10 flex-1 overflow-hidden rounded-md border-2 border-transparent focus-within:border-[#f90]">
          <button
            type="button"
            className="hidden min-w-[58px] items-center justify-center bg-[#e6e6e6] text-[11px] text-[#111] hover:bg-[#d4d4d4] sm:flex"
          >
            All ▾
          </button>
          <input
            readOnly
            value={query}
            aria-label="search query"
            className="w-full bg-white px-3 text-[14px] text-[#111] outline-none"
          />
          <button
            type="button"
            className="w-11 bg-[#febd69] text-[16px] text-[#111] transition hover:bg-[#f3a847]"
            aria-label="submit search"
          >
            🔍
          </button>
        </div>

        <div className="hidden items-center gap-1 text-[11px] lg:flex">
          <button
            type="button"
            className="min-h-10 min-w-[108px] border border-transparent px-2 text-left hover:border-white"
          >
            <div className="text-[10px] text-[#ccc]">Hello, sign in</div>
            <div className="text-[12px] font-semibold">Account & Lists</div>
          </button>
          <button
            type="button"
            className="min-h-10 min-w-[86px] border border-transparent px-2 text-left hover:border-white"
          >
            <div className="text-[10px] text-[#ccc]">Returns</div>
            <div className="text-[12px] font-semibold">& Orders</div>
          </button>
          <button
            type="button"
            className="flex min-h-10 min-w-[78px] items-end justify-center gap-1 border border-transparent px-2 pb-1 hover:border-white"
          >
            <span className="text-[17px]">🛒</span>
            <span className="text-[12px] font-semibold leading-none">Cart</span>
          </button>
        </div>
      </div>

      <div className="flex h-9 items-center gap-3 overflow-x-auto bg-[#232f3e] px-3 text-[12px]">
        {["Kitchen", "Small Appliances", "Prime Delivery", "Deals", "Customer Service"].map(
          (item) => (
            <button
              key={item}
              type="button"
              className="shrink-0 border border-transparent px-1.5 py-[2px] hover:border-white"
            >
              {item}
            </button>
          ),
        )}
      </div>
    </header>
  );
}
