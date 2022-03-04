import React, {useEffect, useState} from "react";
import './styles.css'
import SentimentChart from "./SentimentChart/SentimentChart";

export const SentimentAnalytics = ({messages}) => {
    const [sentimentData, setSentimentData] = useState([]);
    const [overallSentiment, setOverAllSentiment] = useState("");

    const getFrequencyMapOfSentiments = (sentimentData) => {
        return sentimentData.reduce((frequencyMap, sentiment) => {
            const suggestedSentiment = sentiment.suggestedSentiment.toLowerCase();
            frequencyMap[suggestedSentiment] ? ++frequencyMap[suggestedSentiment] : frequencyMap[suggestedSentiment] = 1;
            return frequencyMap;
        }, {});
    }

    const getMaximumFrequencySentiment = frequencyMap => {
        let overallSentiment = undefined;
        let maxCount = 0;
        for (const sentiment in frequencyMap) {
            if (frequencyMap[sentiment] > maxCount) {
                maxCount = frequencyMap[sentiment];
                overallSentiment = sentiment;
            }
        }

        return overallSentiment;
    }

    const getCapitalized = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        const data = messages.map(message => {
            return {
                userName: message.from.name,
                sentimentPolarityScore: message.sentiment && message.sentiment.polarity && message.sentiment.polarity.score ? message.sentiment.polarity.score : 0,
                suggestedSentiment: message.sentiment && message.sentiment.suggested ? message.sentiment.suggested : 'NA',
                message: message.text
            };
        });

        setSentimentData(data);
    }, [messages])

    useEffect(() => {
        const frequencyMap = getFrequencyMapOfSentiments(sentimentData);
        const sentiment = getMaximumFrequencySentiment(frequencyMap);
        setOverAllSentiment(sentiment);
    }, [sentimentData]);


    const getEmoji = sentiment => {
        switch (sentiment) {
            case "positive":
                return <span style={{fontSize: '28px'}}>&#x1F60E;</span>;
            case "negative":
                return <span style={{fontSize: '28px'}}>&#x1F61F;</span>;
            case "neutral":
                return <span style={{fontSize: '28px'}}>&#x1F60C;</span>;
        }
    }

    return (
        <div className="sentiment-analysis-container">
            <h1>Sentiment Analysis</h1>
            <div className="sentiment-analysis-data">
                <SentimentChart sentimentData={sentimentData}/>
                {overallSentiment ?
                    <div className="sentiment-analysis-calculated-data">
                        <h2 style={{fontSize: 20}}>
                            Overall Sentiment:
                            <span className={`sentiment-${overallSentiment.toLowerCase()}`}>
                                &nbsp;{getCapitalized(overallSentiment)}&nbsp;
                                {getEmoji(overallSentiment)}
                            </span>
                        </h2>
                    </div>
                    : null}
            </div>
        </div>
    );
}

export default React.memo(SentimentAnalytics);