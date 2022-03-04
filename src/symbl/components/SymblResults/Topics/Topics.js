import React from "react";
import Topic from "./Topic/Topic";
import './styles.css'

export const Topics = ({topics}) => {
    return (
        <div className="topics-container">
            <h1>Topics</h1>
            <div className="topics-data-container">
                {topics && topics.length > 0 ?
                    topics.map(topic => <Topic topic={topic} key={topic.id}/>)
                    : <h3><i>No topics available</i></h3>}
            </div>
        </div>
    );
}

export default React.memo(Topics);