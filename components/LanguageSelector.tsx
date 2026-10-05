"use client";
import React from 'react'

const LANGUAGES = {
    English: "eng_Latn",
    French: "fra_Latn",
    Spanish: "spa_Latn",
    German: "deu_Latn",
    Hindi: "hin_Deva",
    Tamil: "tam_Taml",
    Telugu: "tel_Telu",
    Kannada: "kan_Knda",
    Malayalam: "mal_Mlym",
    Japanese: "jpn_Jpan",
    Korean: "kor_Hang",
}

type Props = {
    type: string;
    defaultLanguage: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const LanguageSelector = ({ type,
    defaultLanguage,
    onChange,
}: Props) => {
    return (
        <div>
            <label>{type}</label>

            <select onChange={onChange}
                defaultValue={defaultLanguage}>
                {Object.entries(LANGUAGES).map(([name, index]) => (
                    <option key={index} value={index}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LanguageSelector