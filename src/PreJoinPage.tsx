import {faBolt, faCommentDots, faPlus} from '@fortawesome/free-solid-svg-icons'
import {createLocalVideoTrack, LocalVideoTrack} from 'livekit-client'
import {AudioSelectButton, ControlButton, VideoRenderer, VideoSelectButton} from 'livekit-react'
import { config } from 'process'
import React, {ReactElement, useEffect, useState, useRef} from "react"
import {AspectRatio} from 'react-aspect-ratio'
import {useNavigate} from 'react-router-dom'

interface PreJoinPageProps {
    customVocabulary: Array<string>,
    addVocabPhrase: (phrase: string) => void
}

export const PreJoinPage = ({customVocabulary, addVocabPhrase}: PreJoinPageProps) => {
    // state to pass onto room
    const [url, setUrl] = useState('wss://demo.livekit.cloud')
    const [token, setToken] = useState<string>('')
    const [simulcast, setSimulcast] = useState(true)
    const [dynacast, setDynacast] = useState(true)
    const [adaptiveStream, setAdaptiveStream] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(false)
    const [audioEnabled, setAudioEnabled] = useState(true)
    // state for custom vocabulary
    const [customVocabularyPopupEnabled, setCustomVocabularyPopupEnabled] = useState(false);
    const [addVocabBtnDisabled, setAddVocabBtnDisabled] = useState(true);
    // disable connect button unless validated
    const [connectDisabled, setConnectDisabled] = useState(true)
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
    const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
    const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
    const navigate = useNavigate()
    const vocabPhraseInputRef = useRef<HTMLInputElement>(null);

    

    useEffect(() => {
        if (token && url) {
            setConnectDisabled(false)
        } else {
            setConnectDisabled(true)
        }
    }, [token, url])

    const toggleVideo = async () => {
        if (videoTrack) {
            videoTrack.stop()
            setVideoEnabled(false)
            setVideoTrack(undefined)
        } else {
            const track = await createLocalVideoTrack({
                deviceId: videoDevice?.deviceId,
            })
            setVideoEnabled(true)
            setVideoTrack(track)
        }
    }

    useEffect(() => {
        // enable video by default
        createLocalVideoTrack({
            deviceId: videoDevice?.deviceId,
        }).then((track) => {
            setVideoEnabled(true)
            setVideoTrack(track)
        })
    }, [videoDevice])

    const toggleAudio = () => {
        if (audioEnabled) {
            setAudioEnabled(false)
        } else {
            setAudioEnabled(true)
        }
    }

    const selectVideoDevice = (device: MediaDeviceInfo) => {
        setVideoDevice(device);
        if (videoTrack) {
            if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
                return
            }
            // stop video
            videoTrack.stop()
        }
    }

    const connectToRoom = async () => {
        if (videoTrack) {
            videoTrack.stop()
        }

        if (window.location.protocol === 'https:' &&
            url.startsWith('ws://') && !url.startsWith('ws://localhost')) {
            alert('Unable to connect to insecure websocket from https');
            return
        }

        const params: { [key: string]: string } = {
            url,
            token,
            videoEnabled: videoEnabled ? '1' : '0',
            audioEnabled: audioEnabled ? '1' : '0',
            simulcast: simulcast ? '1' : '0',
            dynacast: dynacast ? '1' : '0',
            adaptiveStream: adaptiveStream ? '1' : '0',
        }
        if (audioDevice) {
            params.audioDeviceId = audioDevice.deviceId;
        }
        if (videoDevice) {
            params.videoDeviceId = videoDevice.deviceId;
        } else if (videoTrack) {
            // pass along current device id to ensure camera device match
            const deviceId = await videoTrack.getDeviceId();
            if (deviceId) {
                params.videoDeviceId = deviceId;
            }
        }
        navigate({
            pathname: '/room',
            search: "?" + new URLSearchParams(params).toString()
        })
    }

    const toggleCustomVocabPopup = () => {
        setCustomVocabularyPopupEnabled(!customVocabularyPopupEnabled);
    }

    const pushVocabPhrase = () => {
        if(vocabPhraseInputRef.current &&  vocabPhraseInputRef.current.value) {
            addVocabPhrase(vocabPhraseInputRef.current.value);
            vocabPhraseInputRef.current.value = "";
        }
    }

    const checkVocabInputValid = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(vocabPhraseInputRef.current &&  vocabPhraseInputRef.current.value) {
            setAddVocabBtnDisabled(false);
        } else {
            setAddVocabBtnDisabled(true);
        }
    }

    let videoElement: ReactElement;
    if (videoTrack) {
        videoElement = <VideoRenderer track={videoTrack} isLocal={true}/>;
    } else {
        videoElement = <div className="placeholder"/>
    }

    return (
        <div className="prejoin">
            <main>
                <h2>LiveKit Video</h2>
                <hr/>
                <div className="entrySection">
                    <div>
                        <div className="label">
                            LiveKit URL
                        </div>
                        <div>
                            <input type="text" name="url" value={url} onChange={e => setUrl(e.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <div className="label">
                            Token
                        </div>
                        <div>
                            <input type="text" name="token" value={token} onChange={e => setToken(e.target.value)}/>
                        </div>
                    </div>
                    <div className="options">
                        <div>
                            <input id="simulcast-option" type="checkbox" name="simulcast" checked={simulcast}
                                   onChange={e => setSimulcast(e.target.checked)}/>
                            <label htmlFor="simulcast-option">Simulcast</label>
                        </div>
                        <div>
                            <input id="dynacast-option" type="checkbox" name="dynacast" checked={dynacast}
                                   onChange={e => setDynacast(e.target.checked)}/>
                            <label htmlFor="dynacast-option">Dynacast</label>
                        </div>
                        <div>
                            <input id="adaptivestream-option" type="checkbox" name="adaptiveStream"
                                   checked={adaptiveStream} onChange={e => setAdaptiveStream(e.target.checked)}/>
                            <label htmlFor="adaptivestream-option">Adaptive Stream</label>
                        </div>
                    </div>
                </div>

                <div className="videoSection">
                    <AspectRatio ratio={16 / 9}>
                        {videoElement}
                    </AspectRatio>
                </div>

                <div className="controlSection">
                    <div>
                        <AudioSelectButton
                            isMuted={!audioEnabled}
                            onClick={toggleAudio}
                            onSourceSelected={setAudioDevice}
                        />
                        <VideoSelectButton
                            isEnabled={videoTrack !== undefined}
                            onClick={toggleVideo}
                            onSourceSelected={selectVideoDevice}
                        />
                        <ControlButton 
                            label={`${customVocabularyPopupEnabled ? "Close" : "Open"} Vocabularies`}
                            icon={faCommentDots}
                            onClick={toggleCustomVocabPopup}
                        />
                    </div>
                    <div className="right">
                        <ControlButton
                            label="Connect"
                            disabled={connectDisabled}
                            icon={faBolt}
                            onClick={connectToRoom}/>
                    </div>
                </div>
                {   customVocabularyPopupEnabled &&
                    <div className="entrySection">
                        <div>
                            <div className="label">
                                Vocabulary Phrase
                            </div>
                            <div>
                                <input type="text" name="vocab" ref={vocabPhraseInputRef} onChange={checkVocabInputValid}/>
                            </div>
                            <div>
                                <ControlButton 
                                    label='Add Phrase'
                                    disabled={addVocabBtnDisabled}
                                    icon={faPlus}
                                    onClick={pushVocabPhrase}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='label'>
                                Custom Vocabulary Phrases
                            </div>
                            <div>
                                <ul>
                                    {
                                        customVocabulary.map((vocab, index) =>
                                            <li key={index}>
                                                {vocab}
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                }
            </main>
            <footer>
                This page is built with <a href="https://github.com/livekit/livekit-react">LiveKit React</a>&nbsp;
                (<a href="https://github.com/livekit/livekit-react/blob/master/example/src/PreJoinPage.tsx">source</a>)
            </footer>
        </div>
    )
}
