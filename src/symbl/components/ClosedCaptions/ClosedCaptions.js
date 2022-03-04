import React, {useEffect, useState} from "react";
import './styles.css'

export const ClosedCaptions = ({closedCaption}) => {

    const [displayClosedCaption, setDisplayClosedCaption] = useState(false);
    const [timeOutHandler, setTimeOutHandler] = useState(0);
    const NO_OF_MILLISECONDS = 2000;

    const cleanup = () => {
        clearTimeout(timeOutHandler);
        setTimeOutHandler(0);
    }

    useEffect(() => {

        cleanup();

        if (!displayClosedCaption) {
            setDisplayClosedCaption(true);
        }

        const handler = setTimeout(() => {
            setDisplayClosedCaption(false);
        }, NO_OF_MILLISECONDS);

        setTimeOutHandler(handler);

        return cleanup;
    }, [closedCaption]);


    return (<>
            {displayClosedCaption ?
                <div className="closed-captions-wrapper">
                    <div className="closed-captions-container">
                        <div className="closed-captions-username">{closedCaption.userName}</div>
                        <span>:&nbsp;</span>
                        <div className="closed-captions-text">{closedCaption.text}</div>
                    </div>
                </div> : null}
        </>
    );
}

export default React.memo(ClosedCaptions);