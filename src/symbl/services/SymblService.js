const {generateAccessToken} = require("../apis/generateAccessToken");
const {getMessagesWithSentiments} = require("../apis/getMessagesWithSentiments");
const {getAnalyticsMetric} = require("../apis/getAnalyticsMetric");
const {Logger} = require('../utils/Logger');

export default class SymblService {

    STARTING = "starting";
    STARTED = "started";
    STOPPED = "stopped";
    NO_OF_MILLISECONDS = 10 * 1000;

    constructor(config, meetingId, meetingTitle, participantId, participantName, handlers, stream) {
        this.config = config;
        this.audioContext = undefined;
        this.webSocket = undefined;
        this.status = undefined;
        this.connectionHandlingInProgress = false;
        this.retryCount = config.retryCount || 3;
        this.gainNode = undefined;
        this.meetingId = meetingId;
        this.meetingTitle = meetingTitle;
        this.localParticipant = {id: participantId, name: participantName}
        this.handlers = handlers;
        this.stream = stream;
        this.accessToken = undefined;
        this.conversationId = undefined;
        this.analyticsStartedHandler = undefined;

        this.processAudio = this.processAudio.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.mute = this.mute.bind(this);
        this.unmute = this.unmute.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.isConnectionStarted = this.isConnectionStarted.bind(this);
        this.isConnectionStopped = this.isConnectionStopped.bind(this);
        this.sendStartRecognitionRequest = this.sendStartRecognitionRequest.bind(this);
        this.generateAccessToken = this.generateAccessToken.bind(this);
        this.openConnectionAndStart = this.openConnectionAndStart.bind(this);
        this.createAudioProcessingTopology = this.createAudioProcessingTopology.bind(this);
        this.onMessageResponse = this.onMessageResponse.bind(this);
        this.onInsightResponse = this.onInsightResponse.bind(this);
        this.onTopicResponse = this.onTopicResponse.bind(this);
        this.onTrackerResponse = this.onTrackerResponse.bind(this);
        this.onSpeechDetected = this.onSpeechDetected.bind(this);
        this.onMessageSentimentsUpdated = this.onMessageSentimentsUpdated.bind(this);
        this.onAnalyticsMetricUpdated = this.onAnalyticsMetricUpdated.bind(this);
    }


    start() {
        if (this.isConnectionStopped()) {
            Logger.debug("symbl connection already closed");
            return;
        }

        this.changeStatus(this.STARTING);

        if (!this.audioContext) {
            this.audioContext = this.createAudioProcessingTopology(this.stream);
        }
        this.sendStartRecognitionRequest();
    }

    stop() {
        if (this.isConnectionStopped()) {
            Logger.info("Symbl connection is already stopped");
            return;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify({type: 'stop_request'}));
        }
        this.changeStatus(this.STOPPED);
        clearInterval(this.analyticsStartedHandler);
        this.analyticsStartedHandler = undefined;
        this.webSocket.close();
    }

    mute() {
        if (this.gainNode) {
            this.gainNode.gain.value = 0;
            Logger.info('Muted');
        }
        // TODO: Stop and start recognition service.
    }

    unmute() {
        if (this.gainNode) {
            this.gainNode.gain.value = 1;
            Logger.info('Unmuted');
        }
    }

    changeStatus(status) {
        this.status = status;
    }

    isConnectionStarted() {
        return this.status === this.STARTED;
    }

    isConnectionStopped() {
        return this.status === this.STOPPED;
    }

    sendStartRecognitionRequest() {
        if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
            Logger.error('WebSocket connection is not established. Cannot start symbl.');
            return;
        }

        this.webSocket.send(JSON.stringify({
            type: 'start_request',
            insightTypes: this.config.insightTypes,
            config: {
                confidenceThreshold: this.config.confidenceThreshold,
                timezoneOffset: this.config.timezoneOffset || -480,
                languageCode: this.config.languageCode || "en-US",
                meetingTitle: this.meetingTitle,
                sentiment: this.config.realtimeSentimentAnalysis || false,
                speechRecognition: {
                    languageCode: this.config.languageCode,
                    sampleRateHertz: this.audioContext.sampleRate,
                    mode: this.config.mode || 'multi-speaker',
                    enableAutomaticPunctuation: true
                }
            },
            speaker: {
                userId: this.localParticipant && this.localParticipant.id,
                name: this.localParticipant && this.localParticipant.name
            },
            trackers: this.config.trackers
        }));
    }

    async generateAccessToken() {
        if (this.accessToken) {
            return;
        }
        const {appId, appSecret, generateTokenEndpoint} = this.config;
        this.accessToken = await generateAccessToken(appId, appSecret, generateTokenEndpoint);
    }

    async openConnectionAndStart() {
        try {
            await this.generateAccessToken();

            if (!this.accessToken) {
                return;
            }

            this.webSocket = new WebSocket(`${this.config.wssBasePath}/v1/realtime/insights/${this.meetingId}?access_token=${this.accessToken}`);

            this.webSocket.onclose = this.onEnd.bind(this);
            this.webSocket.onerror = this.onError.bind(this);
            this.webSocket.onmessage = this.onMessageReceived.bind(this);
            this.webSocket.onopen = async event => {
                Logger.debug('Connection established with symbl.');
                await this.start();
            };
        } catch (err) {
            Logger.error("Failed to open connection and start request", err);
        }
    }


    onEnd(event) {
        Logger.info('Symbl connection is stopped');
    }

    onError(event) {
        if (event.message && event.message.type === 'error') {
            const errorPayload = event.message.payload;
            Logger.error('', errorPayload);
        } else {
            Logger.error('', event);
        }
    }

    onMessageReceived(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
            const {message: {type}} = data;

            if (type === 'recognition_started') {
                this.changeStatus(this.STARTED);
                this.retryCount = 0;
                this.connectionHandlingInProgress = false;
                this.conversationId = data.message.data.conversationId;
                Logger.info(`Conversation Id is: ${this.conversationId}`);
            } else if (type === 'recognition_result') {
                this.onSpeechDetected(data.message);
            }

            if (type === 'error') {
                this.onError(data);
            }
        } else {
            if (data.type === 'message_response') {
                this.onMessageResponse(data.messages);
            } else if (data.type === 'insight_response') {
                this.onInsightResponse(data.insights);
            } else if (data.type === 'topic_response') {
                this.onTopicResponse(data.topics);
            } else if (data.type === 'tracker_response' && data.isFinal) {
                this.onTrackerResponse(data.trackers);
            }
        }
    }

    onAnalyticsMetricUpdated() {
        getAnalyticsMetric(this.config.apiBasePath, this.accessToken, this.conversationId)
            .then(analyticsMetric => this.handlers.onAnalyticsMetricUpdated(analyticsMetric))
            .catch(error => Logger.error("Failed to fetch the analytics details", error));
    }

    onMessageSentimentsUpdated() {
        getMessagesWithSentiments(this.config.apiBasePath, this.accessToken, this.conversationId)
            .then(messages => this.handlers.onMessageSentimentsUpdated(messages))
            .catch(error => Logger.error("Failed to fetch the messages with sentiment details", error));
    }

    onSpeechDetected(data) {
        if (this.handlers.onSpeechDetected) {
            this.handlers.onSpeechDetected(data);
            if (!data.isFinal) {
                return;
            }

            if (this.config.realtimeSentimentAnalysis) {
                this.onMessageSentimentsUpdated();
            }

            if (this.config.realtimeAnalyticsMetric && !this.analyticsStartedHandler) {
                this.analyticsStartedHandler = setInterval(() => this.onAnalyticsMetricUpdated(), this.NO_OF_MILLISECONDS);
                this.onAnalyticsMetricUpdated();
            }
        }
    }

    onMessageResponse(messages) {
        if (this.handlers.onMessageResponse) {
            this.handlers.onMessageResponse(messages);
        }
    }

    onInsightResponse(messages) {
        if (this.handlers.onInsightResponse) {
            this.handlers.onInsightResponse(messages);
        }
    }

    onTopicResponse(topics) {
        if (this.handlers.onTopicResponse) {
            this.handlers.onTopicResponse(topics);
        }
    }

    onTrackerResponse(trackers) {
        if (this.handlers.onTrackerResponse) {
            this.handlers.onTrackerResponse(trackers);
        }
    }


    createAudioProcessingTopology(stream) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;      // 'webkitAudioContext' for Safari and old versions of Chrome
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(this.config.bufferSize, 1, 1);
        this.gainNode = context.createGain();
        source.connect(this.gainNode);
        this.gainNode.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = this.processAudio;
        return context;
    }


    processAudio(event) {
        if (!this.isConnectionStarted()) {
            return;
        }

        const inputData = event.inputBuffer.getChannelData(0) || new Float32Array(this.config.bufferSize);
        const targetBuffer = new Int16Array(inputData.length);
        for (let index = inputData.length; index > 0; index--) {
            targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
        }

        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(targetBuffer.buffer);
            return;
        }

        if (this.webSocket.readyState !== WebSocket.OPEN && !this.connectionHandlingInProgress) {
            this.connectionHandlingInProgress = true;
            this.stop();
            const retry = async () => {
                if (this.retryCount < this.config.retryCount && this.webSocket.readyState !== WebSocket.OPEN) {
                    Logger.info(`Retry attempt: ${this.retryCount}`);
                    await this.openConnectionAndStart();
                    this.retryCount++;
                    setTimeout(retry, 2000 * this.retryCount);
                }
            };
            setTimeout(retry, 0);
        }
    }
}