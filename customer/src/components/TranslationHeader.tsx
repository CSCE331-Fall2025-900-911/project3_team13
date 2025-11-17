export default function TranslationHeader() {
    // More languages will be added.
    return (
        <div>
            <label htmlFor="languages">Click to Select Language:</label>
            <select name="languages" id="languages">
                <option value="English">English</option>
                <option value="Español">Español</option>
                <option value="Français">Français</option>
                <option value="Suomi">Suomi</option>
            </select>
        </div>
    )
}