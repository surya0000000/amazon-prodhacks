interface SearchChromeProps {
  query: string;
}

export function SearchChrome({ query }: SearchChromeProps) {
  return (
    <header className="sticky top-0 z-30 w-full text-white shadow-sm">
      <div className="flex h-[60px] items-center gap-2 bg-[#131921] px-3">
        <div className="flex h-10 min-w-[116px] items-center justify-center border border-transparent px-2 text-xs font-semibold tracking-wide hover:border-white">
          marketplace
        </div>
        <div className="hidden min-w-[130px] border border-transparent p-1 text-[11px] leading-tight hover:border-white sm:block">
          <div className="text-[10px] text-gray-300">Deliver to</div>
          <div className="font-semibold text-white">Location Placeholder</div>
        </div>
        <div className="flex h-10 flex-1 overflow-hidden rounded-[3px]">
          <div className="flex min-w-[52px] items-center justify-center bg-[#f3f3f3] text-[11px] text-[#333]">
            All
          </div>
          <input
            readOnly
            value={query}
            aria-label="search query"
            className="w-full bg-white px-3 text-sm text-[#111] outline-none"
          />
          <button
            type="button"
            className="w-11 bg-[#febd69] text-[#111] transition hover:bg-[#f3a847]"
          >
            🔍
          </button>
        </div>
        <div className="hidden items-center gap-2 text-[11px] sm:flex">
          <button className="min-h-10 min-w-[76px] border border-transparent px-2 text-left hover:border-white">
            <div className="text-[10px] text-gray-300">Hello, Sign in</div>
            <div className="font-semibold">Account</div>
          </button>
          <button className="min-h-10 min-w-[72px] border border-transparent px-2 text-left hover:border-white">
            <div className="text-[10px] text-gray-300">Returns</div>
            <div className="font-semibold">& Orders</div>
          </button>
          <button className="flex min-h-10 min-w-[72px] items-center justify-center border border-transparent px-2 font-semibold hover:border-white">
            Cart
          </button>
        </div>
      </div>
      <div className="flex h-9 items-center gap-4 overflow-x-auto bg-[#232f3e] px-3 text-[12px]">
        {[
          "All",
          "Today's Deals",
          "Kitchen",
          "Small Appliances",
          "Prime Delivery",
          "Customer Service",
          "Gift Cards",
          "Registry",
        ].map((item) => (
          <button
            key={item}
            className="shrink-0 border border-transparent px-1 py-[2px] hover:border-white"
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}
