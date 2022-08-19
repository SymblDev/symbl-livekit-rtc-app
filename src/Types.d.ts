export interface Vocabularies {
    vocabulary: Array<string>;
    vocabularyStrength: Array<{ text: string }>;
}

export interface VocabOperations {
    addVocabularyPhrase: (phrase: string) => void;
    addVocabularyStrengthPhrase: (phrase: string) => void;
}