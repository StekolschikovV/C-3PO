import React from "react"
import {ILanguage} from "pages/translator/languageList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faVolumeHigh} from "@fortawesome/free-solid-svg-icons";

interface IProps {
    text: string
    language?: ILanguage
}

const TranslatorButtons = ({text, language}: IProps) => {

    const read = (fromText: string, fromLanguage: ILanguage) => {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(fromText);
        utterance.lang = fromLanguage.code;
        synthesis.speak(utterance);
    }

    return <ul className={"icon absolute right-6 top-6 cursor-pointer flex flex-col gap-3"}>
        {language && <li>
            <FontAwesomeIcon
                className={"icon cursor-pointer"}
                size={"1x"}
                onClick={() => read(text, language)}
                icon={faVolumeHigh}/>
        </li>}
        <li>
            <FontAwesomeIcon
                className={"icon cursor-pointer"}
                size={"lg"}
                onClick={() => navigator.clipboard.writeText(text)}
                icon={faCopy}/>
        </li>
    </ul>

}

export default TranslatorButtons
