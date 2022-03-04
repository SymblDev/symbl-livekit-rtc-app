import React from "react";
import './styles.css';

export const Insight = ({insight}) => {

    const getInsightType = type => {
        switch (type) {
            case "action_item":
                return "Action Item";
            case "follow_up":
                return "Follow Up";
            case "question":
                return "Question";
            default:
                return type;
        }
    }

    return (
        <div className={`insight-container-${insight.isSender ? "sender" : "receiver"}`}>
            <div className={`insight-data-container-${insight.isSender ? "sender" : "receiver"}`}>
                <div className="insight-top-container">
                    <div className="insight-type">{getInsightType(insight.type)}</div>
                </div>
                <div className="insight-text">{insight.text}</div>
                <div className="insight-bottom-container">
                    <div className="insight-assignee">{insight.assignee}</div>
                    <div className="insight-timestamp">{insight.timestamp}</div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Insight);