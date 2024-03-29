import {makeAutoObservable, reaction} from "mobx";
import {IConfig, IHistoryRecord, IHotKey, TMainCommand} from "../../type";
import {translateText} from "../../render/pages/utilities/translateText";

const defaultConfig = {
    hotKeys: [{key: 'META+G', page: 'translator'}],
    autoStart: false,
    windowHeight: 600,
    windowWidth: 730,
    translator: {
        from: {name: "English", code: "en"},
        to: {name: "Russian", code: "ru"}
    },
    tabs: {
        translator: {
            on: true,
            autofill: true,
            autofillOut: true,
            isReverse: false
        },
        history: {
            on: true,
            autofill: false,
            autofillOut: false
        },
        conjugation: {
            on: true,
            autofill: false,
            autofillOut: false
        },
        context: {
            on: true,
            autofill: false,
            autofillOut: false
        },
        synonyms: {
            on: true,
            autofill: false,
            autofillOut: false
        },
        spellCheck: {
            on: true,
            autofill: false,
            autofillOut: false
        },
        wikipedia: {
            on: true,
            autofill: false,
            autofillOut: false
        }
    }
}


export type RootStoreHydration = {
    [key: string]: {
        hydrateFromLocalStore: () => void
    }
};

export class RootStore {

    clipboard = ""
    activeEvent = 0
    openPage = ""
    config: IConfig = defaultConfig
    history: IHistoryRecord[] = []
    isStopUpdate = false

    translatorText = {
        from: "",
        to: ""
    }

    constructor() {
        makeAutoObservable(this);
        this.listeners()
        this.loadConfig()
        this.loadHistory()
    }

    listeners = () => {
        // redirect to page from main.js
        window.electronAPI.openPage((value: string) => {
            this.openPage = value
        })

        // reaction
        reaction(
            () => JSON.stringify(this.config),
            () => {
                if (!this.isStopUpdate) {
                    this.translateText()
                    this.saveConfig()
                }
            }
        )
        reaction(
            () => JSON.stringify(this.translatorText),
            () => {
                if (!this.isStopUpdate) {
                    this.translateText(true)
                }
            }
        )

    }

    translateText = async (tryReverse = false) => {
        const translatedText = await translateText(this.translatorText.from, this.config.translator.from.code, this.config.translator.to.code)
        if (tryReverse && this.config?.tabs?.translator?.isReverse) {
            const isNoResult = this.translatorText.from.trim() === translatedText.trim()
            if (isNoResult) {
                const translatedText2 = await translateText(this.translatorText.from, this.config.translator.to.code, this.config.translator.from.code)
                const isNoResult2 = this.translatorText.from.trim() === translatedText2.trim()
                if (!isNoResult2) {
                    this.isStopUpdate = true
                    const tempFrom = this.config.translator.from
                    this.config.translator.from = this.config.translator.to
                    this.config.translator.to = tempFrom
                    this.translatorText.to = translatedText2
                    if (this.config?.tabs.translator.autofillOut)
                        navigator.clipboard.writeText(translatedText2)
                    setTimeout(() => {
                        this.isStopUpdate = false
                    }, 0)
                }
            } else {
                this.translatorText.to = translatedText
                if (this.config?.tabs.translator.autofillOut)
                    navigator.clipboard.writeText(translatedText)
            }
        } else {
            this.translatorText.to = translatedText
            if (this.config?.tabs.translator.autofillOut)
                navigator.clipboard.writeText(translatedText)
        }
        if (this.translatorText.from.trim().length === 0) {
            this.translatorText.to = ""
        }

    }


    hydrate(data: RootStoreHydration) {
        //
    }

    setClipboard = (text: string) => {
        this.clipboard = text.trim()
    }

    setActiveEvent = () => {
        this.activeEvent = this.activeEvent + 1
        this.activeListeners()
    }

    activeListeners = () => {
        this.setHistory(this.clipboard)
    }

    saveConfig = () => {
        window.electronAPI?.config(JSON.stringify({
            type: "config",
            value: {
                key: "save",
                value: this.config
            }
        }))
    }

    addHotKey = (key: IHotKey[], page: string) => {
        let newKey: null | string = null
        if (key.length > 0) {
            newKey = `${key[0].name}+${key[1].name}`
            this.config.hotKeys.push({key: newKey, page})
        } else if (this.config.hotKeys.filter(e => e.page === page)) {
            this.config.hotKeys = this.config.hotKeys.filter(e => e.page !== page)
        }
        this.config.hotKeys = [...new Map(this.config.hotKeys.map(v => [v.key, v])).values()]
        this.config.hotKeys = [...new Map(this.config.hotKeys.map(v => [v.page, v])).values()]
        this.saveConfig()
    }

    loadConfig = async () => {
        const config = await window.electronAPI.config(JSON.stringify({
            type: "config",
            value: {
                key: "load"
            }
        }))
        if (config) this.config = this.setConfigDefaultValue(config)
    }
    setConfigDefaultValue = (config: IConfig) => {
        return {...defaultConfig, ...config}
    }

    loadHistory = async () => {
        const history = await window.electronAPI.history(JSON.stringify({
            type: "history",
            value: {
                key: "load"
            }
        }))
        if (history) this.history = history
    }

    mainCommand = (command: TMainCommand) => {
        window?.electronAPI?.mainCommand(JSON.stringify({
            type: command
        }))
            .finally()
            .catch()
    }

    setHistory = (text: string) => {
        text = text.trim()
        if (text.length === 0) return
        const date = new Date()
        const time = date.getTime()
        const record: IHistoryRecord = {text, time}
        this.history.push(record)
        window.electronAPI?.history(JSON.stringify({
            type: "history",
            value: {
                key: "set",
                value: this.history
            }
        }))
    }

    clearHistory = () => {
        window.electronAPI?.history(JSON.stringify({
            type: "history",
            value: {
                key: "clear",
                value: this.history
            }
        }))
        this.history = []
    }

    resetConfig = () => {
        this.config = defaultConfig
        this.saveConfig()
    }

}
