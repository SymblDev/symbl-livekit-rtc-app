import 'livekit-react/dist/index.css'
import React, {useState} from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {PreJoinPage} from './PreJoinPage'
import {RoomPage} from './RoomPage'
import {Vocabularies} from './Types';

const App = () => {
    const [customVocabulary, setCustomVocabulary] = useState<Vocabularies>({
        vocabulary: [],
        vocabularyStrength: []
    });

    const vocabOperations = {
        addVocabularyPhrase: (phrase: string) => {
            setCustomVocabulary(prev => ({
                vocabulary: [...prev.vocabulary, phrase],
                vocabularyStrength: prev.vocabularyStrength
            }));
        },
        addVocabularyStrengthPhrase: (phrase: string) => {
            setCustomVocabulary(prev => ({
                vocabulary: prev.vocabulary,
                vocabularyStrength: [...prev.vocabularyStrength, { text: phrase }]
            }));
        }
    }

    return (
        <div className="container">
            <Router>
                <Routes>
                    <Route path="/" element={<PreJoinPage customVocabulary={customVocabulary} vocabOperations={vocabOperations}/>}/>
                    <Route path="/room" element={<RoomPage customVocabulary={customVocabulary}/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
