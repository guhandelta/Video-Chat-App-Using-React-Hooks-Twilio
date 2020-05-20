// This component will be the top level component for handling the data about the chat. 
import React, { useState } from 'react';

// The username for the user that is joining the chat, a room name for the room they are going to connect to, and their access token-
//-  once it has been fetched from the server,  will be stored in the componnet state using the useState() hook. 

const VideoChat = () => {
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState(null);

    return <div></div> // we'll build up our response later
};


export default VideoChat;