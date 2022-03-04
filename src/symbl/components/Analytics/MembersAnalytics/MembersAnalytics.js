import React, {useEffect, useState} from "react";
import './styles.css'

export const MembersAnalytics = ({members}) => {
    const [membersData, setMembersData] = useState([]);

    const isValid = member => {
        return member && member.name && member.talkTime && member.talkTime.percentage && member.talkTime.seconds;
    }

    useEffect(() => {
        const data = members
            .filter(member => isValid(member))
            .map(member => {
                return {
                    name: member.name,
                    talkTimePercentage: member.talkTime.percentage,
                    talkTimeSeconds: member.talkTime.seconds
                };
            });

        setMembersData(data);
    }, [members])

    return (
        <div className="members-analytics-container">
            <h1 style={{fontSize: 20}}>Members Metrics</h1>
            <div className="members-analytics-data">
                <ul>
                    {membersData.length > 0 ?
                        membersData.map((member, key) => {
                            return (
                                <li key={key}><span>
                            <h2>{member.name} talked for {member.talkTimeSeconds} seconds</h2>
                            <progress value={member.talkTimePercentage} max={100}/></span>
                                </li>
                            );
                        }) : <i>No metrics available</i>}
                </ul>
            </div>
        </div>
    );
}

export default React.memo(MembersAnalytics);