import React, {ReactNode} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

interface Props {
    type?: "normal" | "active"
    size: 1 | 2
    clickHandler?: () => void
    children?: ReactNode
    addedArrow?: boolean
}

const Btn = ({addedArrow, type, clickHandler, size, children}: Props) => {

    const textSize = size === 1 ? 16 : 18
    const bgColor = type === "normal" ? "gray" : "yellow"
    const textColor = type === "normal" ? "white" : "gray"
    const height = size === 1 ? 35.5 : 40

    return <>
        <button
            className={`items-center flex bg-${bgColor} gap-2 px-[${15 * size}px]  rounded text-[${textSize}px] text-${textColor} hover:bg-yellow hover:text-gray transition active:opacity-80 outline-0 border-0 h-[${height}px]`}
            onClick={clickHandler}
        >
            {children}
            {addedArrow === true && <>
                <FontAwesomeIcon icon={faCaretDown}/>
            </>}
            {addedArrow === false && <>
                <FontAwesomeIcon icon={faCaretUp}/>
            </>}
        </button>
    </>
}

export default Btn
