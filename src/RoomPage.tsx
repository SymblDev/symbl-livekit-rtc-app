import {faSquare, faThLarge, faUserFriends} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {ParticipantEvent, Room, RoomEvent, VideoPresets} from 'livekit-client'
import {DisplayContext, DisplayOptions, LiveKitRoom} from 'livekit-react'
import React, {useState} from "react"
import "react-aspect-ratio/aspect-ratio.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {useSymbl} from './symbl/hooks/useSymbl'
import Symbl from "./symbl/components/Symbl/Symbl";

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0)
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  })
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const url = query.get('url')
  const token = query.get('token')
  const recorder = query.get('recorder')

  const [symblConfig, setSymblConfig] = useState<any>({});
  const {
    closedCaption,
    transcripts,
    insights,
    topics,
    trackers,
    messagesWithSentiment,
    analyticsMetric,
    muteSymbl,
    unmuteSymbl,
  } = useSymbl(symblConfig)

  if (!url || !token) {
    return (
        <div>
          url and token are required
        </div>
    )
  }

  const onLeave = async () => {
    navigate('/')
  }

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  }

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room)

    /* Special rule for recorder */
    if (recorder && parseInt(recorder, 10) === 1 && room.participants.size === 0) {
      console.log("END_RECORDING")
    }
  }

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  }

  return (
      <DisplayContext.Provider value={displayOptions}>
        <div className="roomContainer">
          <div className="topBar">
            <h2>LiveKit Video</h2>
            <div className="right">
              <div>
                <input id="showStats" type="checkbox"
                       onChange={(e) => updateOptions({showStats: e.target.checked})}/>
                <label htmlFor="showStats">Show Stats</label>
              </div>
              <div>
                <button
                    className="iconButton"
                    disabled={displayOptions.stageLayout === 'grid'}
                    onClick={() => {
                      updateOptions({stageLayout: 'grid'})
                    }}
                >
                  <FontAwesomeIcon height={32} icon={faThLarge}/>
                </button>
                <button
                    className="iconButton"
                    disabled={displayOptions.stageLayout === 'speaker'}
                    onClick={() => {
                      updateOptions({stageLayout: 'speaker'})
                    }}
                >
                  <FontAwesomeIcon height={32} icon={faSquare}/>
                </button>
              </div>
              <div className="participantCount">
                <FontAwesomeIcon icon={faUserFriends}/>
                <span>{numParticipants}</span>
              </div>
            </div>
          </div>
          <LiveKitRoom
              url={url}
              token={token}
              onConnected={room => {
                onConnected(room, query);
                getSymblConfig(room).then(config => setSymblConfig(config));
                room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room))
                room.on(RoomEvent.ParticipantDisconnected, () => onParticipantDisconnected(room))
                room.localParticipant.on(ParticipantEvent.TrackMuted, muteSymbl);
                room.localParticipant.on(ParticipantEvent.TrackUnmuted, unmuteSymbl);
                updateParticipantSize(room);
              }}
              connectOptions={{
                adaptiveStream: isSet(query, 'adaptiveStream'),
                dynacast: isSet(query, 'dynacast'),
                videoCaptureDefaults: {
                  resolution: VideoPresets.hd.resolution,
                },
                publishDefaults: {
                  videoEncoding: VideoPresets.hd.encoding,
                  simulcast: isSet(query, 'simulcast'),
                },
                logLevel: 'debug',
              }}
              onLeave={onLeave}
          />
          <Symbl
              closedCaption={closedCaption}
              transcripts={transcripts}
              insights={insights}
              topics={topics}
              trackers={trackers}
              messagesWithSentiment={messagesWithSentiment}
              analyticsMetric={analyticsMetric}
          />
        </div>
      </DisplayContext.Provider>
  )
}

const getSymblConfig = async (room: Room) => {
  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
  const participantId = room.localParticipant.identity;
  const participantName = room.localParticipant.name ? room.localParticipant.name : participantId;
  const meetingId = room.sid;
  const meetingName = room.name;
  return {meetingId, meetingName, participantId, participantName, stream};
}

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, 'audioEnabled')) {
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, 'videoEnabled')) {
    const videoDeviceId = query.get('videoDeviceId');
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true';
}
