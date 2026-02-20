interface FilterSection {
  title: string;
  items: Array<{ label: string; checked?: boolean }>;
}

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: "Departments",
    items: [
      { label: "Small Appliances", checked: true },
      { label: "Countertop Ovens", checked: true },
      { label: "Smart Kitchen" },
      { label: "Home & Kitchen" },
      { label: "Accessories" },
    ],
  },
  {
    title: "Fulfillment",
    items: [
      { label: "Prime eligible", checked: true },
      { label: "Free delivery by tomorrow" },
      { label: "Ships from local warehouse", checked: true },
    ],
  },
  {
    title: "Intent Layer Signals",
    items: [
      { label: "Core appliance confidence: high", checked: true },
      { label: "Accessory suppression active", checked: true },
      { label: "Duplicate collapse active", checked: true },
      { label: "Attribute validation applied", checked: true },
    ],
  },
];

function FakeCheckbox({ checked = false }: { checked?: boolean }) {
  return (
    <span
      className={`inline-flex h-[13px] w-[13px] items-center justify-center border ${
        checked ? "border-[#007185] bg-[#007185] text-white" : "border-[#888] bg-white"
      }`}
      aria-hidden="true"
    >
      {checked ? "✓" : ""}
    </span>
  );
}

export function FilterSidebar() {
  return (
    <aside className="hidden w-[250px] shrink-0 space-y-2 xl:block">
      {FILTER_SECTIONS.map((section) => (
        <section key={section.title} className="border border-[#d5d9d9] bg-white p-3">
          <h2 className="text-[13px] font-bold text-[#0f1111]">{section.title}</h2>
          <ul className="mt-2 space-y-1.5">
            {section.items.map((item) => (
              <li key={item.label} className="flex items-start gap-1.5 text-[12px] text-[#0f1111]">
                <FakeCheckbox checked={item.checked} />
                <button type="button" className="text-left leading-4 hover:text-[#c7511f]">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
