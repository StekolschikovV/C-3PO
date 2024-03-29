export interface ILanguage {
    name: string;
    code: string;
}

export const languages: ILanguage[] = [
    {name: 'Afrikaans', code: 'af'},
    {name: 'Irish', code: 'ga'},
    {name: 'Albanian', code: 'sq'},
    {name: 'Italian', code: 'it'},
    {name: 'Arabic', code: 'ar'},
    {name: 'Japanese', code: 'ja'},
    {name: 'Azerbaijani', code: 'az'},
    {name: 'Kannada', code: 'kn'},
    {name: 'Basque', code: 'eu'},
    {name: 'Korean', code: 'ko'},
    {name: 'Bengali', code: 'bn'},
    {name: 'Latin', code: 'la'},
    {name: 'Belarusian', code: 'be'},
    {name: 'Latvian', code: 'lv'},
    {name: 'Bulgarian', code: 'bg'},
    {name: 'Lithuanian', code: 'lt'},
    {name: 'Catalan', code: 'ca'},
    {name: 'Macedonian', code: 'mk'},
    {name: 'Chinese Simplified', code: 'zh-CN'},
    {name: 'Malay', code: 'ms'},
    {name: 'Chinese Traditional', code: 'zh-TW'},
    {name: 'Maltese', code: 'mt'},
    {name: 'Croatian', code: 'hr'},
    {name: 'Norwegian', code: 'no'},
    {name: 'Czech', code: 'cs'},
    {name: 'Persian', code: 'fa'},
    {name: 'Danish', code: 'da'},
    {name: 'Polish', code: 'pl'},
    {name: 'Dutch', code: 'nl'},
    {name: 'Portuguese', code: 'pt'},
    {name: 'English', code: 'en'},
    {name: 'Romanian', code: 'ro'},
    {name: 'Esperanto', code: 'eo'},
    {name: 'Russian', code: 'ru'},
    {name: 'Estonian', code: 'et'},
    {name: 'Serbian', code: 'sr'},
    {name: 'Filipino', code: 'tl'},
    {name: 'Slovak', code: 'sk'},
    {name: 'Finnish', code: 'fi'},
    {name: 'Slovenian', code: 'sl'},
    {name: 'French', code: 'fr'},
    {name: 'Spanish', code: 'es'},
    {name: 'Galician', code: 'gl'},
    {name: 'Swahili', code: 'sw'},
    {name: 'Georgian', code: 'ka'},
    {name: 'Swedish', code: 'sv'},
    {name: 'German', code: 'de'},
    {name: 'Tamil', code: 'ta'},
    {name: 'Greek', code: 'el'},
    {name: 'Telugu', code: 'te'},
    {name: 'Gujarati', code: 'gu'},
    {name: 'Thai', code: 'th'},
    {name: 'Haitian Creole', code: 'ht'},
    {name: 'Turkish', code: 'tr'},
    {name: 'Hebrew', code: 'iw'},
    {name: 'Ukrainian', code: 'uk'},
    {name: 'Hindi', code: 'hi'},
    {name: 'Urdu', code: 'ur'},
    {name: 'Hungarian', code: 'hu'},
    {name: 'Vietnamese', code: 'vi'},
    {name: 'Icelandic', code: 'is'},
    {name: 'Welsh', code: 'cy'},
    {name: 'Indonesian', code: 'id'},
    {name: 'Yiddish', code: 'yi'}
];

export const getLanguageByCode = (code: string): ILanguage | null => {
    return languages.filter(language => language.code === code)[0] || null
}

export const getLanguageByName = (name: string): ILanguage | null => {
    return languages.filter(language => language.name === name)[0] || null
}

