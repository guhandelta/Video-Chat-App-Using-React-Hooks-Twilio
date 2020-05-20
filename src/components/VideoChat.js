// This component will be the top level component for handling the data about the chat. 
import React, { useState, useCallback } from 'react';
import Lobby from './Lobby'

// The username for the user that is joining the chat, a room name for the room they are going to connect to, and their access token-
//-  once it has been fetched from the server,  will be stored in the componnet state using the useState() hook. 

const VideoChat = () => {
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState(null);

    // Every time this function component is called the handle functions are redefined.They need to be part of the component because-
    //- they rely on the setUsername and setRoomName functions, but they will be the same every time.useCallback is a React hook-
    //- that allows us to memoize the functions.That is, if they are the same between function invocations, they won't get redefined.
    const handleUsernameChange = useCallback(event => {
        setUsername(event.target.value);
    }, []);
    // useCallback takes two arguments, the function to be memoized and an array of the function's dependencies. If any of the functions'- 
    //- dependencies change, that implies the memoized function is out of date and the function is then redefined and memoized again.
    const handleRoomNameChange = useCallback(event => {
        setRoomName(event.target.value);
    }, []);
    // In this case, there are no dependencies to these two functions, so an empty array will suffice(setState() from useState hook are- 
    //- deemed to be constant within the function). Rewriting this function, a useCallback should be provided to the import at the top-
    //- of the file and then wrap each of these functions.

    // Send username and roomname using fetch(), as JSON to the endpoint, to receibe and setToken to  thestatetore the token in our state
    // To make the function will dependent on the username and roomName, it's wrapped with a callBack() hook and the dependencies to it
    const handleSubmit = useCallback(async event => {
        event.preventDefault();
        const data = await fetch('/video/token', {
            method: 'POST',
            body: JSON.stringify({
                identity: username,
                room: roomName
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        setToken(data.token);
    }, [username, roomName]);

    // Logout() will eject the user from a room and return them to the lobby, by setting the token to null. Once again, we wrap this up in useCallback with no dependencies.
    const handleLogout = useCallback(event => {
        setToken(null);
    }, []);

    // Render the Lobby unless a token is available, otherwise render the username, roomName and token
    let render;
    if (token) {
        render = (
            <div>
                <p>Username: {username}</p>
                <p>Room name: {roomName}</p>
                <p>Token: {token}</p>
            </div>
        );
    } else {
        render = (
            <Lobby
                username={username}
                roomName={roomName}
                handleUsernameChange={handleUsernameChange}
                handleRoomNameChange={handleRoomNameChange}
                handleSubmit={handleSubmit}
            />
        );
    }

    return render;
};


export default VideoChat;