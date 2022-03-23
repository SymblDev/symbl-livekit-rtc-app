# Symbl LiveKit RTC App

[![Websocket][symbl_websocket_bright_green_badge]][symbl_streaming_api_docs]


Symbl's APIs empower developers to enable:
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provides a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

**This app is provided for demonstration purposes only. Please feel free to report any issue in the `Issues` section.**

<hr />


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
    - [Setup](#setup)
    - [Run Locally](#run-locally)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Community](#community)
- [License](#license)

## Introduction
This is a multi-party video-conferencing application that demonstrates [Symbl's Real-time APIs][symbl_streaming_api_docs].

## Features

- Live Closed Captioning
- [Real-time Transcription](## "Real-time Transcription with different color coding scheme for Senders and Receivers")
- [Real-time Insights: Questions, Action Items and Follow-ups](## "Real-time Insights with different color coding scheme for Senders and Receivers")
- Real-time Topics with sentiments
- Real-time Trackers detection
- [Real-time Sentiment Analysis of the conversations](## "Real-time sentiment analysis (sentence level) and aggregated/overall sentiment categorisation of the conversations. This is demonstrated using a linear graph.")
- [Real-time Meeting metrics](## "Pie Chart to demonstrate the total_talktime, total_silence and total_overlapping_time")
- [Real-time Member metrics](## "Demonstrates the talktime/contribution of a member in the conversations")
- Video conferencing with real-time video and audio
- Enable/Disable camera
- Mute/unmute mic
- Screen sharing

## Pre-requisites

- [Node JS (version 14+)](node_js_download_link)
- [Symbl Account][symbl_signup]

## Installation

### Setup

1. Clone the project

```bash
  git clone https://github.com/SymblDev/symbl-livekit-rtc-app.git
```

2. Go to the project directory

```bash
  cd symbl-livekit-rtc-app
```

3. Install dependencies

```bash
  npm install
```

### Run Locally
1. Navigate to the `src/symbl/config/` directory and open the `config.js` file.
2. Add your Symbl `App Id` and `App Secret` values in the respective fields below:

```javascript
  appId: '',
  appSecret: ''
```

3. Modify the rest of the configuration such as Trackers, Sentiment Analytics as per requirements. [Optional]
```javascript
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
  ]
```

4. Start the application.
```npm
npm start
```
The application will be started at [http://localhost:3000](http://localhost:3000)

## Usage
1. Navigate to [http://localhost:3000](http://localhost:3000)

2. Enter the LiveKit URL
> If the LiveKit server is not running at the localhost, we can utilize the LiveKit's playground server URL.
> ```http request
>    wss://demo.livekit.cloud
> ```

3. Enter the `Token` generated using the LivekKit's Server.
> If the LiveKit server is not running at the localhost, we can utilize the LiveKit's playground server URL to generate token.
> ```
>    curl --location --request POST 'https://livekit.io/api/playground/tokens' \
>    --header 'authority: livekit.io' \
>    --header 'Content-Type: text/plain;charset=UTF-8' \
>    --data-raw '{
>        "roomName": "tower",
>        "userName": "Stark"
>    }'
> ```

4. Click on `Connect` to enter the Room.

5. Closed Captioning will appear on the screen as soon as a person start speaking.

6. To view the Symbl Results (Transcripts, Insights, Topics, Trackers), click on the down arrow that appear in bottom right corner as soon as Symbl's intelligence is generated. 

## Screenshots

- Live Closed Captioning
  ![Live Closed Captioning](screenshots/Live_Closed_Captioning.png)
<br><br>
- Real-time Transcripts, Insights (Action Items, Questions and Follow Ups), Topics and Trackers 
  ![Real-time_Transcripts_Insights_Topics_Trackers](screenshots/Real-time_Transcripts_Insights_Topics_Trackers.png)
<br><br>
- Real-time Topics with sentiments
  ![Real-time_Topics_With_Sentiments](screenshots/Real-time_Topics_With_Sentiments.png)
<br><br>
- Sentiment and Meeting Analytics
  ![Sentiment_And_Meeting_Analytics](screenshots/Sentiment_And_Meeting_Analytics.png)
<br><br>
- Sentiment Analysis with overall sentiment
  ![Sentiment_Analysis_With_Overall_Sentiment](screenshots/Sentiment_Analysis_With_Overall_Sentiment.png)

## Community

If you have any questions, feel free to reach out to us at `devrelations@symbl.ai` or through our [Community Slack][slack] or our [forum][developer_community].

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions, and feedback. If you liked our integration guide, please star our repo!

## License

This library is released under the [MIT][license]

[license]: LICENSE.txt
[symbl_websocket_bright_green_badge]: https://img.shields.io/badge/symbl-websocket-brightgreen
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[symbl_streaming_api_docs]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA
[issues]: https://github.com/symblai/symbl-livekit-rtc-app/issues
[pulls]: https://github.com/symblai/symbl-livekit-rtc-app/pulls
[node_js_download_link]: https://nodejs.org/en/download/
[symbl_signup]: https://platform.symbl.ai/#/signup?utm_source=get-info&utm_medium=marcelo&utm_campaign=rep