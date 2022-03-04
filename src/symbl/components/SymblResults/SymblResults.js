import React from "react";
import Transcripts from "./Transcripts/Transcripts";
import Insights from "./Insights/Insights";
import Topics from "./Topics/Topics";
import Trackers from "./Trackers/Trackers";
import './styles.css'

export const SymblResults = ({transcripts, insights, topics, trackers = []}) => {
    return (
        <div className="symbl-results-container">
            <div className="symbl-results-transcripts-grid">
                <Transcripts transcripts={transcripts}/>
            </div>
            <div className="symbl-results-insights-topics-grid">
                <div className="symbl-results-insights-grid">
                    <Insights insights={insights}/>
                </div>
                <div className="symbl-results-topics-grid">
                    <Topics topics={topics}/>
                </div>
            </div>
            {trackers.length > 0 ?
                <div className="symbl-results-trackers-grid">
                    <Trackers trackers={trackers}/>
                </div>
                : null
            }
        </div>
    );
}

export default React.memo(SymblResults);