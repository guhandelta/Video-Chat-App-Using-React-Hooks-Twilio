// This component doesn't need to store any data as it will pass all events up to its parent(VideoChat) component. When the component-
//- is rendered it will be passed the username and roomName as well as the functions to handle changes to each and handle submitting-
// the form, those props can be destructured to make it easier for later use.
import React from 'react';

const Lobby = ({
    username,
    handleUsernameChange,
    roomName,
    handleRoomNameChange,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter a room</h2>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="field"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="room">Room name:</label>
                <input
                    type="text"
                    id="room"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Lobby;