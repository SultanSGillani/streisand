
export function numericIdentifier(id: string): number {
    // Most of the identifiers are numeric but the values parsed from the url are strings.
    // So we need to convert the string value into a numeric.
    const result = parseInt(id, 10);
    return isNaN(result) ? -404 : result;
}