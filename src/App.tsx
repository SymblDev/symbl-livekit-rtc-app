import 'livekit-react/dist/index.css'
import React, {useState} from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {PreJoinPage} from './PreJoinPage'
import {RoomPage} from './RoomPage'

const App = () => {
    const [customVocabulary, setCustomVocabulary] = useState<Array<string>>([]);

    const addVocabPhrase = (phrase: string) => {
        setCustomVocabulary([...customVocabulary, phrase]);
    }

    return (
        <div className="container">
            <Router>
                <Routes>
                    <Route path="/" element={<PreJoinPage customVocabulary={customVocabulary} addVocabPhrase={addVocabPhrase}/>}/>
                    <Route path="/room" element={<RoomPage customVocabulary={customVocabulary}/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
