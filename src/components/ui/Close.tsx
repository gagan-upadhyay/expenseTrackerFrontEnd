import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface CloseProps{
    onReset:()=> void;
    onToggleEye:()=> void;
    eye:boolean;
    eyeOpen:boolean;
    disabled?:boolean;
    AdjustXClass:string;

}

const Close:React.FC<CloseProps> = ({onReset, onToggleEye,eye, eyeOpen, disabled, AdjustXClass})=>(
    <div className="flex relative border-black md:top-1 w-10">
        <button
        onClick={onReset}
        className={classNames("relative md:w-3 md:h-3 outline-none cursor-pointer w-4", AdjustXClass)}
        disabled={disabled}
        type="button"
        >
            <XMarkIcon />
        </button>
        {eye && <button
        disabled={disabled}
        onClick={onToggleEye}
        className="relative w-4 lg:w-5 lg:h-4 outline-none"
        type="button"
        >
            {eyeOpen ? <EyeIcon /> : <EyeSlashIcon />}
        </button>}
  </div>
)

export default Close;