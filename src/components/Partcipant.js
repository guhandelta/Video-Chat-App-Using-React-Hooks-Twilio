// Will be passing a participant object in the props and keeping track of the participant's video and audio tracks with useState

import React, { useState, useEffect, useRef } from 'react';

const Participant = ({ participant }) => {
    const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);

    // The video or audio stream from a participant, should be attached to a <video> or <audio> element.As JSX is declarative, direct-
    //- access to the DOM is not available, useRef() hook is used here to get a reference to the HTML element. 
    // React provides access to the DOM via refs and the useRef hook - create the refs using the useRef hook, before  render
    const videoRef = useRef();
    const audioRef = useRef();

    // The participant object is used here to set the initial values for the audio and video tracks. Participant's have videoTracks and- 
    //- audioTracks properties that return a Map of TrackPublication objects. A TrackPublication doesn't have access to its track object- 
    //- until it is subscribed, so we need to filter out any tracks that don't exist. We'll do this with a function that maps from- 
    //-TrackPublications to Tracks and filters out any that are null.
    const trackpubsToTracks = trackMap => Array.from(trackMap.values())
        .map(publication => publication.track)
        .filter(track => track !== null);

    //Multiple useEffect() hooks are needed for this component

    //1) This will set the video and audio tracks in the state and set up listeners to the participant object for when tracks- 
    //- are added or removed.It will also need to clean up and remove those listeners and empty the state when the component's unmounted.
    useEffect(() => {
        /* The two functions that will run either when a track is added or removed from the participant. These functions both check- 
         whether the track is an audio or video track and then add or remove it from the state using the relevant state function.*/
        const trackSubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => [...videoTracks, track]);
            } else {
                setAudioTracks(audioTracks => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = track => {
            if (track.kind === 'video') {
                setVideoTracks(videoTracks => videoTracks.filter(v => v !== track));
            } else {
                setAudioTracks(audioTracks => audioTracks.filter(a => a !== track));
            }
        };

        /*  Use the participant object to set the initial values for the audio and video tracks. Participant's have videoTracks and- 
         audioTracks properties that return a Map of TrackPublication objects. A TrackPublication doesn't have access to its track- 
         object until it is subscribed, so we need to filter out any tracks that don't exist, this will be done using a function, that-
        maps from TrackPublications to Tracks and filters out any that are null */
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        //Set up listeners to the trackSubscribed and trackUnsubscribed events and then do the cleanup in the returned function
        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]); // This hook only depends on the participant object and won't be cleaned up and re-run unless the participant changes.

    // This hook will get the first video track from the state and, if it exists, attach it to the DOM node captured with a ref, earlier.
    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);//The current DOM node in the ref is using videoRef.current
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);
    
    // This hook will get the first audio track from the state and, if it exists, attach it to the DOM node aptured with a ref, earlier.
    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);//The current DOM node in the ref is using videoRef.current
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    //attributes of the <video> and <audio> tags are set to autoplay, so that they play as soon as they have a media stream 
    return (
        <div className="participant">
            <h3>{participant.identity}</h3>
            <video ref={videoRef} autoPlay={true} />
            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
    );

};


export default Participant;