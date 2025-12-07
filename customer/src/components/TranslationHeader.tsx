import { useTranslation } from "react-i18next";
import i18n from '../i18n';

export default function TranslationHeader() {
    const { t } = useTranslation();

    const changeLanguage = (lng: string) => {
        // guard in case i18n isn't initialized; prefer the exported instance
        if (i18n && typeof i18n.changeLanguage === 'function') {
            i18n.changeLanguage(lng);
        }
    }
    // More languages will be added.
    return (
        <div>
            <label htmlFor="languages">{t('header.selectLanguage')}</label>
            <select
                name="languages"
                id="languages"
                value={(i18n && (i18n.resolvedLanguage || i18n.language)) || 'en'}
                onChange={(e) => changeLanguage(e.target.value)}
            >
                <option value="en">{t('header.english')}</option>
                <option value="es">{t('header.spanish')}</option>
                <option value="fr">{t('header.french')}</option>
                <option value="de">{t('header.german')}</option>
                <option value="it">{t('header.italian')}</option>
            </select>
        </div>
    )
}