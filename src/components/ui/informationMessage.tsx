import { InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface TooltipIconProps {
  message: string;
  classX:string;
}

const TooltipIcon = ({ message, classX }: TooltipIconProps) => (
  <div className="relative group">
    <InformationCircleIcon className="w-5 h-5 ml-[-35] mt-2 cursor-pointer" />
    <div className={clsx("absolute  bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-90 transition-all duration-200", 
        classX
    )
    }>
      {message}
    </div>
  </div>
);

export default TooltipIcon;
