import React, {useState} from "react"
import Input from "../../UI/Input";
import Btn from "../../UI/Btn";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import Reverso from "reverso-api";

const reverso = new Reverso()

const Context = () => {

    const [text, setText] = useState("")
    const [selectMode, setSelectMode] = useState<null | "from" | "to">(null)
    const [langFrom, setLangFrom] = useState("russian")
    const [langTo, setLangTo] = useState("english")

    const lanList = [
        'arabic',
        'german',
        'spanish',
        'french',
        'hebrew',
        'italian',
        'japanese',
        'dutch',
        'polish',
        'portuguese',
        'romanian',
        'russian',
        'turkish',
        'chinese',
        'english'
    ]

    const data: {
        l1: string
        l2: string
    }[] = [
        {
            l1: 'Потому что "мама мыла раму", а "Apple любит музыку".',
            l2: 'Because "mom soap frame", and "Apple loves music".'
        },
        {
            l1: 'Моя мама мыла посуду, слушая радио.',
            l2: 'I was in the kitchen washing dishes, listening to the radio.'
        },
        {
            l1: 'Когда-то моя мама мыла посуду в этом ресторане.',
            l2: 'My mom used to wash dishes at this restaurant.'
        },
        {
            l1: 'Потому что "мама мыла раму", а "Apple любит музыку".',
            l2: 'Because "mom soap frame", and "Apple loves music".'
        },
        {
            l1: 'Моя мама мыла посуду, слушая радио.',
            l2: 'I was in the kitchen washing dishes, listening to the radio.'
        },
        {
            l1: 'Когда-то моя мама мыла посуду в этом ресторане.',
            l2: 'My mom used to wash dishes at this restaurant.'
        },
        {
            l1: 'Потому что "мама мыла раму", а "Apple любит музыку".',
            l2: 'Because "mom soap frame", and "Apple loves music".'
        },
        {
            l1: 'Моя мама мыла посуду, слушая радио.',
            l2: 'I was in the kitchen washing dishes, listening to the radio.'
        },
        {
            l1: 'Когда-то моя мама мыла посуду в этом ресторане.',
            l2: 'My mom used to wash dishes at this restaurant.'
        },
        {
            l1: 'Потому что "мама мыла раму", а "Apple любит музыку".',
            l2: 'Because "mom soap frame", and "Apple loves music".'
        },
        {
            l1: 'Моя мама мыла посуду, слушая радио.',
            l2: 'I was in the kitchen washing dishes, listening to the radio.'
        },
        {
            l1: 'Когда-то моя мама мыла посуду в этом ресторане.',
            l2: 'My mom used to wash dishes at this restaurant.'
        }
    ]

    const selectModeHandler = (l: null | "from" | "to") => {
        setSelectMode(selectMode !== l ? l : null)
    }

    const selectLang = (l: string, position: "from" | "to" | null) => {
        selectModeHandler(null)
        if (position) {
            if (position === "from") {
                setLangFrom(l)
            } else {
                setLangTo(l)
            }
        }
    }

    const getContextHandler = () => {
        reverso.getContext(
            text,
            langFrom,
            langTo,
            (err: any, response: {
                examples: { id: number, source: string, target: string }[]
            }) => {
                const examples = response?.examples
                if (examples) {
                    examples.forEach(e => {
                        console.log(e)
                    })
                }
            }
        )
    }

    return <div className={"px-2 pt-4"}>

        <div className={"flex items-center gap-2"}>
            <Input placeholder={"Enter word"} width={100} onChange={e => setText(e)}/>
            <div className={"w-[15px]"}></div>
            <Btn type={"normal"} size={1} clickHandler={() => selectModeHandler("from")}>
                <div className={"capitalize"}>{langFrom}</div>
            </Btn>
            <div className={"text-center"}>
                <FontAwesomeIcon icon={faArrowRight}/>
            </div>
            <Btn type={"normal"} size={1} clickHandler={() => selectModeHandler("to")}>
                <div className={"capitalize"}>{langTo}</div>
            </Btn>
            <Btn type={"normal"} size={1} clickHandler={() => getContextHandler()}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </Btn>
        </div>
        <div className={"my-3 h-[395px] overflow-auto relative"}>
            {selectMode === null && <ul>
                {data.map((e, i) => {
                    return <li key={i} className={"grid grid-cols-2 mb-2"}>
                        <div className={"border-l-4 border-grayDark pl-3"}
                             onClick={() => selectModeHandler("from")}>{e.l1}</div>
                        <div className={"border-l-4 border-grayDark pl-3"}
                             onClick={() => selectModeHandler("to")}>{e.l2}</div>
                    </li>
                })}
            </ul>}
            {selectMode !== null &&
                <ul className={"pt-3 absolute top-0 left-0 bg-grayDark w-full h-full m-0 p-0 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] auto-rows-min gap-3 "}>
                    {lanList.map((e, i) => {
                        return <li key={i} className={"text-center flex h-[35.5px] justify-center"}>
                            <Btn type={"normal"} size={1} clickHandler={() => selectLang(e, selectMode)}>{e}</Btn>
                        </li>
                    })}

                </ul>}
        </div>

    </div>
}

export default Context
