import React from "react";
import './styles.css'

export const Transcript = ({transcript}) => {
    return (
        <div className={`transcript-container-${transcript.isSender ? "sender" : "receiver"}`}>
            <div className={`transcript-data-container-${transcript.isSender ? "sender" : "receiver"}`}>
                <div className="transcript-top-container">
                    <div className="transcript-user">{transcript.userName}</div>
                </div>
                <div className="transcript-text">{transcript.text}</div>
                <div className="transcript-bottom-container">
                    <div className="transcript-timestamp">{transcript.timestamp}</div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Transcript);