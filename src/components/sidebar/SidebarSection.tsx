// import clsx from "clsx";
import { ElementType } from "react";
import SidebarItem from "./SidebarItems"
import clsx from "clsx";

export interface SidebarItemType {
  name: string;
  icon: ElementType;
  href:string,
//   [key: string]: string | ReactNode;
}

interface SidebarSectionProps {
  section: {
    label?: string;
    items: SidebarItemType[];
  };
  expanded: boolean;
}

export default function SidebarSection({ section, expanded }: SidebarSectionProps) {
  return (
    <div>
      {section.label && (
        <div
          className={clsx(
            "px-4 py-3 text-xs font-bold uppercase tracking-wider",
            "text-slate-500 dark:text-slate-400",
            "transition-all duration-300",
            !expanded && "opacity-0 h-0 overflow-hidden px-0 py-0"
          )}
        >
          {section.label}
        </div>
      )}
      <div className="mt-1 flex flex-col gap-1 px-2">
        {section.items.map((item: SidebarItemType) => (
          <SidebarItem key={item.name} item={item} expanded={expanded} />
        ))}
      </div>
    </div>
  );
}