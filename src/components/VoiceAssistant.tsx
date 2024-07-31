import React, { useState, useRef, ChangeEvent } from 'react';

const VoiceAssistant: React.FC = () => {
    const [responseMode, setResponseMode] = useState<'text' | 'audio'>('text');
    const [recording, setRecording] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleResponseModeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setResponseMode(event.target.value as 'text' | 'audio');
        setAssistantResponse(null);
    };

    const handleRecord = async () => {
        if (recording) {
            mediaRecorderRef.current?.stop();
            setRecording(false);
            setAssistantResponse(null);
            if (responseMode === 'text') {
                fetchAssistantResponse();
            }
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            responseMode === "audio" &&
                (
                    mediaRecorderRef.current.ondataavailable = (e) => {
                        const audioUrl = URL.createObjectURL(e.data);
                        setAssistantResponse(audioUrl);

                        if (responseMode === 'audio') {
                            setTimeout(() => {
                                if (audioRef.current) {
                                    audioRef.current.src = audioUrl;
                                    audioRef.current.play();
                                }
                            }, 3000);
                        }
                    }
                )
            mediaRecorderRef.current.start();
            setRecording(true);
        }
    };

    const fetchAssistantResponse = async () => {
        try {
            const response = await fetch('https://run.mocky.io/v3/fa29bc2b-c7f7-458c-b7f0-0da300eec582');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let rawText = await response.text();

            // parse response to JSON
            const data = JSON.parse(rawText.replace(/(\w+):/g, '"$1":'));
            setAssistantResponse(data?.message || 'Unexpected response format.');
        } catch (error) {
            console.error('Error:', error);
            setAssistantResponse('Failed to fetch response.');
        }
    };

    return (
        <div className="voice-assistant">
            <div className="controls">
                <label>
                    <input
                        type="radio"
                        value="text"
                        checked={responseMode === 'text'}
                        onChange={handleResponseModeChange}
                    />
                    Text Response
                </label>
                <label>
                    <input
                        type="radio"
                        value="audio"
                        checked={responseMode === 'audio'}
                        onChange={handleResponseModeChange}
                    />
                    Audio Response
                </label>
            </div>
            <button onClick={handleRecord}>{recording ? 'Stop Recording' : 'Start Recording'}</button>
            {responseMode === 'text' && assistantResponse && (
                <div className="response">{assistantResponse}</div>
            )}
            {responseMode === 'audio' && (
                <audio ref={audioRef} controls style={{ display: 'none' }} />
            )}
        </div>
    );
};

export default VoiceAssistant;
