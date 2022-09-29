const config = {
    // appId: '753673564e6571596c48427a45626638467a644646454857553472304f476c70',
    // appSecret: '5a576d517244755a5564544f5558796e674861313748527a5f5863614b4b383251305557444644652d4142594c6b5238555a75693155474c2d755f4e4a684744',
    // generateTokenEndpoint: 'https://api-dev.symbl.ai/oauth2/token:generate',
    // wssBasePath: 'wss://api-dev.symbl.ai',
    // apiBasePath: 'https://api-dev.symbl.ai',
    appId: '6d7a345172595a577a324261736b644e634b486974726a6e63664f5575696736',
    appSecret: '4a6a39584e6a48414f6f685a6447307048516e7744534b6e65316a47595364354e36596b624d696d6e4d6b576e49423952376744564a7448335a4d39784e736f',
    generateTokenEndpoint: 'https://api-labs.symbl.ai/oauth2/token:generate',
    wssBasePath: 'wss://api-labs.symbl.ai',
    apiBasePath: 'https://api-labs.symbl.ai',
    bufferSize: 8192,
    retryCount: 3,
    insightTypes: ["action_item", "question", "follow_up"],
    confidenceThreshold: 0.5,
    timezoneOffset: 480,
    languageCode: 'en-US',
    realtimeSentimentAnalysis: true,
    realtimeAnalyticsMetric: true,
    customVocabulary: ["Symbl", "Symbl.ai"],
    customVocabularyStrength: [],
    detectEntities: true,
    trackers: [
        {
            name: "Promotion Mention",
            vocabulary: [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special",
                "We have a sale right now"
            ]
        },
        {
            name: "Trackers Demo",
            vocabulary: [
                "Trackers is a great feature",
                "Imagine a way to customize what is being tracked for your own business",
                "Trackers allow you to look for a particular mention"
            ]
        },
    ],
    //Symbl Labs PCI/PII Redaction
    redaction: {
        // Enable identification of PII/PCI information
       identifyContent: true, // By default false
       // Enable redaction of PII/PCI information
       redactContent: true, // By default false
       // Use custom string "[PII_PCI_ENTITY]" to replace PII/PCI information with
       redactionString: "*****" // By default ****
   },
   //Copy LiveKit Token Here
   liveKitToken: ''
}

module.exports = config;
