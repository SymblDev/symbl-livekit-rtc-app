import React from 'react';

import {CartesianGrid, Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis,} from 'recharts';

export const SentimentChart = ({sentimentData}) => {
    return (
        <div>
            <LineChart
                width={900}
                height={300}
                data={sentimentData}
                margin={{top: 25, right: 20, bottom: 5, left: 20}}>

                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis label={{value: 'Time', position: 'insideBottomLeft'}} dataKey="userName"/>
                <YAxis label={{value: 'Sentiment', angle: -90, position: 'insideLeft'}}/>
                <Tooltip contentStyle={{background: 'black', borderRadius: '1rem'}}/>
                <Legend/>
                <ReferenceLine
                    y={0}
                    label="Neutral"
                    stroke="red"
                    strokeDasharray="3 3"
                />
                <Line
                    name="Speech Analysis"
                    type="monotone"
                    dataKey="sentimentPolarityScore"
                    stroke="#28c961"
                    activeDot={{r: 8}}
                />
            </LineChart>
        </div>
    );
}

export default React.memo(SentimentChart);