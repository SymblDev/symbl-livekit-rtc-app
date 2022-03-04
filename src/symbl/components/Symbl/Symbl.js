import React, {useRef} from "react";
import './styles.css'
import AnalyticsChart from "../Analytics/AnalyticsChart/AnalyticsChart";
import MembersAnalytics from "../Analytics/MembersAnalytics/MembersAnalytics";
import SentimentAnalytics from "../Analytics/SentimentAnalytics/SentimentAnalytics";
import SymblResults from "../SymblResults/SymblResults";
import ClosedCaptions from "../ClosedCaptions/ClosedCaptions";
import ScrollDownArrow from "../ScrollDownArrow/ScrollDownArrow";

const Symbl = ({
                   closedCaption,
                   transcripts = [],
                   insights = [],
                   topics = [],
                   trackers = [],
                   messagesWithSentiment = [],
                   analyticsMetric = {}
               }) => {

    const symblContainerRef = useRef(null);
    const analyticsContainerRef = useRef(null);

    const scrollDownToSymblContainer = () => symblContainerRef.current.scrollIntoView({behavior: "smooth"});
    const scrollDownToAnalyticsContainer = () => analyticsContainerRef.current.scrollIntoView({behavior: "smooth"});


    const shouldRenderAnalytics = () => {
        return shouldRenderSentimentAnalysis() || shouldRenderAnalyticsMetric();
    }

    const shouldRenderSentimentAnalysis = () => messagesWithSentiment && messagesWithSentiment.length > 0;
    const shouldRenderAnalyticsMetric = () => analyticsMetric && Object.keys(analyticsMetric).length > 0;

    return (
        <>
            <ClosedCaptions closedCaption={closedCaption}/>
            {transcripts.length > 0 || insights.length > 0 || topics.length > 0 ?
                <>
                    <ScrollDownArrow onClick={scrollDownToSymblContainer}/>
                    <div className="symbl-container" ref={symblContainerRef}>
                        <div style={{position: "relative"}}>
                            <SymblResults
                                transcripts={transcripts}
                                insights={insights}
                                topics={topics}
                                trackers={trackers}
                            />
                            {shouldRenderAnalytics() ?
                                <ScrollDownArrow
                                    onClick={scrollDownToAnalyticsContainer}
                                    style={{right: "-20px", bottom: "30px"}}
                                />
                                : null
                            }
                        </div>

                        <div ref={analyticsContainerRef} style={{paddingTop: "10px"}}>
                            {shouldRenderSentimentAnalysis() ?
                                <SentimentAnalytics messages={messagesWithSentiment}/>
                                : null
                            }
                            {shouldRenderAnalyticsMetric() ?
                                <div>
                                    <h1>Meeting Analytics</h1>
                                    <div className="symbl-analytics-container">
                                        <AnalyticsChart metrics={analyticsMetric.metrics}/>
                                        <MembersAnalytics members={analyticsMetric.members}/>
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>
                </>
                : null
            }
        </>
    );
};

export default React.memo(Symbl);
