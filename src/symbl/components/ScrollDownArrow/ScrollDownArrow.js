import React from "react";
import './styles.css';

const ScrollDownArrow = ({onClick, style}) => {
    return (
        <div style={{...style}} className="down-arrow-container" onClick={onClick}>
            <center className="down">
                <div className="ball3"/>
                <div className="spacer"/>
                <div className="ball2"/>
                <div className="spacer"/>
                <div className="ball1"/>
                <div className="arrow"/>
            </center>
        </div>
    );
}

export default React.memo(ScrollDownArrow);