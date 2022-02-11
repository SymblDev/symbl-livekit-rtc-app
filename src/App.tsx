import 'livekit-react/dist/index.css'
import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import {PreJoinPage} from './PreJoinPage'
import {RoomPage} from './RoomPage'

const App = () => {
    return (
        <div className="container">
            <Router>
                <Routes>
                    <Route path="/" element={<PreJoinPage/>}/>
                    <Route path="/room" element={<RoomPage/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App
