import React from "react";
import './styles.css';

export const Topic = ({topic}) => {

    const getEmoji = sentiment => {
        switch (sentiment) {
            case "positive":
                return <span style={{fontSize: '20px'}}>&#x1F60E;</span>;
            case "negative":
                return <span style={{fontSize: '20px'}}>&#x1F61F;</span>;
            case "neutral":
                return <span style={{fontSize: '20px'}}>&#x1F60C;</span>;
        }
    }

    return (
        <span className="topic-container">
            {getEmoji(topic.suggestedSentiment.toLowerCase())}
            <span>&nbsp;{topic.text}</span>
        </span>
    );
}

export default React.memo(Topic);