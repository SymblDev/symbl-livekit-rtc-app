import React, {useEffect, useState} from "react";
import SymblService from "../services/SymblService";
import config from "../config/config";

export const useSymbl = ({meetingId, meetingName, participantId, participantName, stream}) => {

    const [closedCaption, setClosedCaption] = useState({});
    const [transcripts, setTranscripts] = useState([]);
    const [insights, setInsights] = useState([]);
    const [topics, setTopics] = useState([]);
    const [trackers, setTrackers] = useState([]);
    const [messagesWithSentiment, setMessagesWithSentiment] = useState([]);
    const [analyticsMetric, setAnalyticsMetric] = useState({});
    const [symblService, setSymblService] = useState({});
    const [isConnectionStarted, setIsConnectionStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);


    const isEmptyObject = object => {
        return object && Object.keys(object).length === 0 && Object.getPrototypeOf(object) === Object.prototype;
    }

    const isValidRequestForInitialization = () => {
        return !isConnectionStarted && meetingId && meetingName && participantId && participantName && stream;
    }

    const isValidRequestForStoppingSymbl = () => {
        return isConnectionStarted && !isEmptyObject(symblService);
    }

    const initialize = () => {
        if (!isValidRequestForInitialization()) {
            return;
        }

        if (isEmptyObject(symblService)) {
            const service = new SymblService(config, meetingId, meetingName, participantId, participantName, handlers, stream);
            setSymblService(service);
            return;
        }

        symblService.openConnectionAndStart()
            .then(() => setIsConnectionStarted(true));
    }

    const stopSymbl = () => {
        stop();
        setIsConnectionStarted(false);
    }

    const mute = () => {
        if (!isEmptyObject(symblService)) {
            symblService.mute();
        }
    }

    const unmute = () => {
        if (!isEmptyObject(symblService)) {
            symblService.unmute();
        }
    }

    const stop = () => {
        if (isValidRequestForStoppingSymbl()) {
            symblService.stop();
        }
    }

    const muteSymbl = () => {
        setIsMuted(true);
    }

    const unmuteSymbl = () => {
        setIsMuted(false);
    }

    const getCurrentTimestamp = () => {
        return new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    }

    const handlers = {
        onSpeechDetected: (data) => {
            const caption = {
                text: data.punctuated.transcript,
                userId: data.user.id,
                userEmail: data.user.userId,
                userName: data.user.name,
                isSender: data.user.userId === participantId && data.user.name === participantName,
                timestamp: getCurrentTimestamp()
            }
            setClosedCaption(caption);

            if (data.isFinal) {
                setTranscripts(prev => [...prev, caption]);
            }
        },

        onInsightResponse: (data) => {
            const insights = data.map(insight => {
                return {
                    id: insight.id,
                    type: insight.type,
                    text: insight.payload.content,
                    assignee: insight.assignee.name,
                    isSender: insight.from.name === participantName && insight.from.userId === participantId,
                    timestamp: getCurrentTimestamp()
                };
            });
            setInsights(prev => [...prev, ...insights]);
        },

        onTopicResponse: (data) => {
            const topics = data.map(topic => {
                return {
                    id: topic.id,
                    text: topic.phrases,
                    sentimentPolarityScore: topic.sentiment && topic.sentiment.polarity && topic.sentiment.polarity.score ? topic.sentiment.polarity.score : 0,
                    suggestedSentiment: topic.sentiment && topic.sentiment.suggested ? topic.sentiment.suggested : 'NA'
                };
            });

            setTopics(topics);
        },

        onTrackerResponse: (data) => {
            const trackers = data.map(tracker => {
                return tracker.matches.map(match => {
                    return match.messageRefs.map(messageReferences => {
                        return {
                            id: messageReferences.id,
                            name: tracker.name,
                            text: messageReferences.text,
                            offset: messageReferences.offset,
                            timestamp: getCurrentTimestamp()
                        };
                    })
                })
            });

            setTrackers(prev => [...prev, ...trackers.flat(2)]);
        },

        onMessageSentimentsUpdated: (messages) => {
            setMessagesWithSentiment(messages);
        },

        onAnalyticsMetricUpdated: (analyticsMetric) => {
            setAnalyticsMetric(analyticsMetric);
        }
    }

    useEffect(() => {
        initialize();
        return stop;
    }, [meetingId, meetingName, participantId, participantName, stream, symblService, isConnectionStarted]);

    useEffect(() => isMuted ? mute() : unmute(), [isMuted]);

    return {
        closedCaption,
        transcripts,
        insights,
        topics,
        trackers,
        messagesWithSentiment,
        analyticsMetric,
        muteSymbl,
        unmuteSymbl,
        stopSymbl
    };
}