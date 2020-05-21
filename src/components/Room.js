import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';

import Participant from './Partcipant'

const Room = ({ roomName, token, handleLogout }) => {
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);

    const remoteParticipants = participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
    ));

    useEffect(() => {
        const participantConnected = participant => {
            setParticipants(prevParticipants => [...prevParticipants, participant]);
        };
        const participantDisconnected = participant => {
            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p !== participant)
            );
        };
        // `token` and `roomName` are used to connect to the Twilio Video service. When the connection is complete set the room state is set,-
        //- set up a listener for other participants connecting or disconnecting and loop through any existing participants adding them to-
        //- the participants array state using the participantConnected function.
        Video.connect(token, {
            name: roomName
        }).then(room => {
            setRoom(room);
            room.on('participantConnected', participantConnected);
            // room.on('participantDisconnected', participantDisconnected);
            room.participants.forEach(participantConnected);
        });

        return () => {
            setRoom(currentRoom => {
                if (currentRoom && currentRoom.localParticipant.state === 'connected') {
                    currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
                        trackPublication.track.stop();
                    });
                    currentRoom.disconnect();
                    return null;
                } else {
                    return currentRoom;
                }
            });
        };
    }, [roomName, token]);

    return (
        <div className="room">
            <h2>Room: {roomName}</h2>
            <button onClick={handleLogout}>Log out</button>
            <div className="local-participant">
                {room ? (
                    <Participant
                        key={room.localParticipant.sid}
                        participant={room.localParticipant}
                    />
                ) : (
                        ''
                    )}
            </div>
            <h3>Remote Participants</h3>
            <div className="remote-participants">{remoteParticipants}</div>
        </div>
    );
};

export default Room;