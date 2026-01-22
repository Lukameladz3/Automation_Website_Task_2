/**
 * Extract first numeric token from a price string.
 * Examples:
 * - "Rs. 500" -> 500
 * - "$50.00"  -> 50
 */
export function parsePriceToNumber(priceString: string): number {
    const normalized = priceString.replace(/\u00a0/g, ' ');
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
        throw new Error(`Could not parse numeric price from: "${priceString}"`);
    }
    return parseFloat(match[1]);
}

export function pricesMatch(a: string, b: string, epsilon = 0.01): boolean {
    const aNum = parsePriceToNumber(a);
    const bNum = parsePriceToNumber(b);
    return Math.abs(aNum - bNum) < epsilon;
}


