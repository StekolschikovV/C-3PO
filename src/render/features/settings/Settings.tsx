import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import Select from "../../components/Select";
import KeyCapture from "../../components/KeyCapture";

const Settings = () => {

    const [autoStartInitStatus, setAutoStartInitStatus] = useState<boolean | null>(null)

    const onClickAutoStartHandler = async (e: boolean) => {
        await window.electronAPI.autoLaunch(JSON.stringify({
            type: "setStatus",
            value: e.toString()
        }))
    }

    useEffect(() => {
        async function initAutoStart() {
            const status = await window.electronAPI.autoLaunch(JSON.stringify({
                type: "getStatus"
            }))
            setAutoStartInitStatus(status)
        }

        initAutoStart()
    }, []);

    return <div
        className={"bg-grey grid grid-rows-[min-content_minmax(0,1fr)] grid-cols-[1fr] overflow-none"}>
        <div className={"grid grid-cols-[1fr_1fr_1fr] justify-evenly align-middle my-3 mx-2"}>
            <Link to={"/"}>
                <FontAwesomeIcon icon={faAngleLeft} size={"2x"}/>
            </Link>
            <div className={"text-center text-2xl m-auto"}>Settings</div>
        </div>
        <div className={"grid grid-flow-row auto-rows-min gap-4 px-2 py-4 bg-grayDark"}>
            <div className={"grid grid-cols-[1fr_min-content]"}>
                <div>
                    <div className={"text-xl"}>AutoStart</div>
                    <div className={"text-sm"}>Launch the application while the operating system boots.</div>
                </div>
                <div className={"flex align-middle m-auto"}>
                    {autoStartInitStatus !== null &&
                        <Select initValue={autoStartInitStatus} onClick={onClickAutoStartHandler}/>}
                </div>
            </div>
            <div className={"grid grid-cols-[1fr] gap-2"}>
                <div>
                    <div className={"text-xl"}>HotKey</div>
                    <div className={"text-sm"}>Open translator with a shortcut at any time.</div>
                </div>
                <div className={"flex align-middle"}>
                    <KeyCapture/>
                </div>
            </div>
        </div>
    </div>
};

export default Settings;
