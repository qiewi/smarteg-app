/**
 * Converts a string into character trigrams
 * @param text The input string
 * @returns Array of trigrams
 */
function getTrigramsFromString(text: string): string[] {
    const normalized = text.toLowerCase().trim();
    if (normalized.length < 3) return [normalized];
    
    const trigrams: string[] = [];
    for (let i = 0; i < normalized.length - 2; i++) {
        trigrams.push(normalized.slice(i, i + 3));
    }
    return trigrams;
}

/**
 * Creates a frequency map of trigrams
 * @param trigrams Array of trigrams
 * @returns Object with trigram frequencies
 */
function getTrigramFrequencies(trigrams: string[]): { [key: string]: number } {
    return trigrams.reduce((freq: { [key: string]: number }, trigram: string) => {
        freq[trigram] = (freq[trigram] || 0) + 1;
        return freq;
    }, {});
}

/**
 * Calculates the magnitude of a vector
 * @param vector Object representing a vector
 * @returns The magnitude (length) of the vector
 */
function getMagnitude(vector: { [key: string]: number }): number {
    return Math.sqrt(
        Object.values(vector).reduce((sum, val) => sum + val * val, 0)
    );
}

/**
 * Calculates the dot product of two vectors
 * @param vector1 First vector
 * @param vector2 Second vector
 * @returns The dot product
 */
function getDotProduct(
    vector1: { [key: string]: number },
    vector2: { [key: string]: number }
): number {
    return Object.keys(vector1).reduce((sum, key) => {
        return sum + (vector1[key] * (vector2[key] || 0));
    }, 0);
}

/**
 * Calculates the cosine similarity between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score between 0 and 1
 */
export function getStringSimilarity(str1: string, str2: string): number {
    // Get trigrams for both strings
    const trigrams1 = getTrigramsFromString(str1);
    const trigrams2 = getTrigramsFromString(str2);

    // Convert trigrams to frequency vectors
    const vector1 = getTrigramFrequencies(trigrams1);
    const vector2 = getTrigramFrequencies(trigrams2);

    // Calculate cosine similarity
    const dotProduct = getDotProduct(vector1, vector2);
    const magnitude1 = getMagnitude(vector1);
    const magnitude2 = getMagnitude(vector2);

    // Avoid division by zero
    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Checks if a string matches a target phrase using cosine similarity
 * @param input The input string to check
 * @param targetPhrase The target phrase to match against
 * @param threshold The similarity threshold (0 to 1)
 * @returns Whether the input matches the target phrase
 */
export function isPhraseSimilar(
    input: string,
    targetPhrase: string,
    threshold: number = 0.7
): boolean {
    const similarity = getStringSimilarity(input, targetPhrase);
    return similarity >= threshold;
} 