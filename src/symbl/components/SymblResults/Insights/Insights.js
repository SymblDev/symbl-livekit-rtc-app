import React from "react";
import Insight from "./Insight/Insight";
import './styles.css'

export const Insights = ({insights}) => {
    return (
        <div className="insights-container">
            <h1>Insights</h1>
            <div className="insights-data-container">
                {insights && insights.length > 0 ?
                    insights.map(insight => <Insight insight={insight} key={insight.id}/>)
                    : <h3><i>No insights available</i></h3>}
            </div>
        </div>
    );
}

export default React.memo(Insights);