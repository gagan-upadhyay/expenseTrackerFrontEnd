import { PencilSquareIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function PencilIcon({htmlFor, newClass}:{htmlFor:string, newClass:string} ){
    return (
        <label htmlFor={htmlFor} className="cursor-pointer">
            <PencilSquareIcon className={clsx("h-5 w-5 text-gray-700 hover:text-blue-500",
                newClass
            )} />
        </label>
        
    )
}