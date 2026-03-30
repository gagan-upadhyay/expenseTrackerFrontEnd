// import clsx from "clsx";
import { ElementType } from "react";
import SidebarItem from "./SidebarItems"

export interface SidebarItemType {
  name: string;
  icon: ElementType;
  href:string,
//   [key: string]: string | ReactNode;
}

interface SidebarSectionProps {
  section: {
    items: SidebarItemType[];
  };
  expanded: boolean;
}

export default function SidebarSection({ section, expanded }: SidebarSectionProps) {
  return (
    // <div className="">
      <div className="mt-2 flex flex-col gap-1 px-2">
        {section.items.map((item: SidebarItemType) => (
          <SidebarItem key={item.name} item={item} expanded={expanded} />
        ))}
      </div>
    // </div>
  );
}