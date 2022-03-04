const config = {
    appId: '',
    appSecret: '',
    generateTokenEndpoint: 'https://api.symbl.ai/oauth2/token:generate',
    wssBasePath: 'wss://api.symbl.ai',
    apiBasePath: 'https://api.symbl.ai',
    bufferSize: 8192,
    retryCount: 3,
    insightTypes: ["action_item", "question", "follow_up"],
    confidenceThreshold: 0.5,
    timezoneOffset: 480,
    languageCode: 'en-US',
    realtimeSentimentAnalysis: true,
    realtimeAnalyticsMetric: true,
    trackers: [
        {
            name: 'Enable All Trackers',
            vocabulary: [
                "be careful",
                "bankers expected hiring",
                "discussion",
                "separate system",
                "old shop"
            ],
        }
    ],
}

module.exports = config;