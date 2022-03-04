import React from "react";
import Transcript from "./Transcript/Transcript";
import './styles.css'

export const Transcripts = ({transcripts}) => {
    return (
        <div className="transcripts-container">
            <h1>Transcripts</h1>
            <div className="transcripts-data-container">
                {transcripts && transcripts.length > 0 ?
                    transcripts.map((transcript, key) => <Transcript transcript={transcript} key={key}/>)
                    : <h3><i>No transcripts available.</i></h3>}
            </div>
        </div>
    );
}

export default React.memo(Transcripts);