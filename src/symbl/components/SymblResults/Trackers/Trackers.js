import React from "react";
import Tracker from "./Tracker/Tracker";
import './styles.css'

export const Trackers = ({trackers}) => {
    return (
        <div className="trackers-container">
            <h1>Trackers</h1>
            <div className="trackers-data-container">
                {trackers && trackers.length > 0 ?
                    trackers.map(tracker => <Tracker tracker={tracker} key={tracker.id}/>)
                    : <h3><i>No trackers available</i></h3>}
            </div>
        </div>
    );
}

export default React.memo(Trackers);