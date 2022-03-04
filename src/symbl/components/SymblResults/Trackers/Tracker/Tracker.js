import React from "react";
import './styles.css'

export const Tracker = ({tracker}) => {
    return (
        <div className="tracker-container">
            <div className="tracker-data-container">
                <div className="tracker-top-container">
                    <div className="tracker-name">{tracker.name}</div>
                </div>
                <div className="tracker-text">{tracker.text}</div>
                <div className="tracker-bottom-container">
                    <div className="tracker-offset">Offset: {tracker.offset}</div>
                    <div className="tracker-timestamp">{tracker.timestamp}</div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Tracker);