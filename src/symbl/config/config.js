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
            name: "Promotion Mention",
            vocabulary: [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special this month",
                "We have a sale right now on"
            ]
        }
    ],
}

module.exports = config;