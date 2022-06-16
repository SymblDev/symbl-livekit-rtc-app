import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './styles.css'

export const MembersPaceAnalytics = ({members}) => {
    const [membersData, setMembersData] = useState([]);

    const isValid = member => {
        return member && member.name
             && member.pace.wpm;
    }

    useEffect(() => {
        const data = members
            .filter(member => isValid(member))
            .map(member => {
                return {
                    name: member.name,
                    wpm: member.pace.wpm
                };
            });

        console.log(data);
        setMembersData(data);
    }, [members])

    return (
        <div className="members-analytics-container">
        <h1 style={{fontSize: 20}}>Members Pace Analytics</h1>
        <div className="members-analytics-data">
            <BarChart
                width={500}
                height={300}
                data={membersData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wpm" fill="#82ca9d" />
            </BarChart>
        </div>
    </div>
    );
}

export default React.memo(MembersPaceAnalytics);