import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Mic, Share2, Hand, Phone } from "lucide-react";
import io from "socket.io-client";

const VoiceConversation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const BACKEND_URL = "https://talkbrush.com/accent";
    // const BACKEND_URL = "http://127.0.0.1:4444/accent";

    const roomCode = params.roomCode || location.state?.roomCode || null;

    // Socket and Audio Refs
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const isMutedRef = useRef(true);
    const playHeadTimeRef = useRef(0);

    //   TIMING REFS FOR PERFORMANCE TRACKING
    const recordingStartTimeRef = useRef(null);
    const voiceDetectionTimeRef = useRef(null);
    const processingTimesRef = useRef([]);

    // State Management
    const [isListening, setIsListening] = useState(true);
    const [waveAnimation, setWaveAnimation] = useState(0);
    const [currentAccent, setCurrentAccent] = useState('american');
    const [currentGender, setCurrentGender] = useState('male');
    const [handRaised, setHandRaised] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [username, setUsername] = useState(`Guest_${Math.random().toString(36).substr(2, 6)}`);
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ sent: 0, received: 0, latency: 0 });

    //  Audio Queue System (from HTML)
    const audioQueueRef = useRef([]);
    const isPlayingAudioRef = useRef(false);
    const NATURAL_PAUSE_MS = 250;

    const ACCENT_OPTIONS = [
        { value: 'american', label: 'American' },
        { value: 'british', label: 'British' },
        { value: 'australian', label: 'Australian' },
        { value: 'indian', label: 'Indian' },
        { value: 'irish', label: 'Irish' },
        { value: 'portuguese', label: 'Portuguese' },
        { value: 'canadian', label: 'Canadian' },
        { value: 'new_zealand', label: 'New Zealand' },
        { value: 'nigerian', label: 'Nigerian' },
        { value: 'polish', label: 'Polish' },
        { value: 'russian', label: 'Russian' },
        { value: 'german', label: 'German' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'us_midwest', label: 'US – Midwest' },
        { value: 'us_new_york', label: 'US – New York' },
    ];

    // Animate wave
    useEffect(() => {
        if (!isListening) {
            const interval = setInterval(() => {
                setWaveAnimation((prev) => (prev + 1) % 100);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isListening]);

    // Initialize Audio Context
    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        playHeadTimeRef.current = audioContextRef.current.currentTime;
        console.log(' Audio Context initialized');
    }, []);

    // Socket.IO Connection
    useEffect(() => {
        if (!roomCode) {
            alert('No room code provided!');
            return;
        }

        console.log(' Connecting to:', BACKEND_URL);

        socketRef.current = io("https://talkbrush.com", {
            path: "/accent/socket.io/",
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000,
            forceNew: true
        });




        socketRef.current.on('connect', () => {
            console.log('  Connected to server - SID:', socketRef.current.id);
            setIsConnected(true);

            socketRef.current.emit('join_room', {
                room_code: roomCode,
                username: username
            });
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('   Disconnected:', reason);
            setIsConnected(false);
        });

        //   NEW - Handle reconnection
        socketRef.current.on('reconnect', (attemptNumber) => {
            console.log('   Reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);

            // Rejoin room after reconnection
            socketRef.current.emit('join_room', {
                room_code: roomCode,
                username: username
            });
        });

        socketRef.current.on('reconnect_attempt', () => {
            console.log('   Attempting to reconnect...');
        });

        socketRef.current.on('reconnect_error', (error) => {
            console.error('   Reconnection error:', error);
        });

        socketRef.current.on('reconnect_failed', () => {
            console.error('   Reconnection failed after all attempts');
            alert('Connection lost. Please refresh the page.');
        });

        socketRef.current.on('error', (data) => {
            console.error('Socket error:', data);
            alert('Error: ' + data.message);
        });

        socketRef.current.on('user_joined', (data) => {
            console.log('   User joined:', data);
            setParticipants(data.participants || []);
        });

        socketRef.current.on('user_left', (data) => {
            console.log('   User left:', data.username);
            setParticipants(data.participants || []);
        });

        socketRef.current.on('mute_status_changed', (data) => {
            console.log(' Mute status changed:', data);
            setParticipants(data.participants || []);
        });

        socketRef.current.on('hand_status_changed', (data) => {
            console.log(' Hand status changed:', data);
            setParticipants(data.participants || []);
        });

        socketRef.current.on('receive_audio', (data) => {
            const receiveTime = Date.now();
            console.log(`  [RECEIVED] Audio from: ${data.username}`);

            //   LOG END-TO-END LATENCY
            if (data.timestamp) {
                const endToEndLatency = receiveTime - data.timestamp;
                console.log(`⏱ [E2E LATENCY] ${endToEndLatency}ms from sender to receiver`);
            }

            data.receivedTime = receiveTime;
            setStats(prev => ({ ...prev, received: prev.received + 1 }));
            queueAudio(data);
        });

        requestMicrophoneAccess();

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_room', { room_code: roomCode });
                socketRef.current.disconnect();
            }

            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [roomCode, username, navigate]);

    // Request Microphone Access
    const requestMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                }
            });

            const cleanup = setupMediaRecorder(stream); //   Store cleanup function

            //   Store cleanup for later use
            return () => {
                cleanup();
                stream.getTracks().forEach(track => track.stop());
            };

        } catch (error) {
            console.error('   Microphone error:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    //   ISOLATED FROM REACT - No blocking
    const setupMediaRecorder = (stream) => {
        console.log(' Setting up MediaRecorder (React-isolated)...');

        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        });

        let audioChunks = [];
        const CHUNK_DURATION = 4000;
        let recordingTimer = null;
        let isProcessing = false;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        microphone.connect(analyser);
        analyser.fftSize = 256;

        const SILENCE_THRESHOLD = 0.004;  // Lowered from 0.006 for better sensitivity
        let lastLogTime = 0;  // For rate-limiting debug logs

        function detectSpeech() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length / 255;

            // Log detection level every 500ms for debugging
            const now = Date.now();
            if (now - lastLogTime > 500) {
                console.log(`🔊 [AUDIO LEVEL] ${(average * 100).toFixed(2)}% (threshold: ${(SILENCE_THRESHOLD * 100).toFixed(2)}%)`);
                lastLogTime = now;
            }

            return average > SILENCE_THRESHOLD;
        }

        //   CRITICAL: Keep loop running continuously
        let animationFrameId = null;

        function checkVoiceActivity() {
            if (isMutedRef.current) {
                if (mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                    audioChunks = [];
                }
                if (recordingTimer) {
                    clearTimeout(recordingTimer);
                    recordingTimer = null;
                }
                isProcessing = false;
                animationFrameId = requestAnimationFrame(checkVoiceActivity);
                return;
            }

            const speaking = detectSpeech();

            if (speaking) {
                if (mediaRecorderRef.current.state === 'inactive' && !isProcessing) {
                    //   TRACK VOICE DETECTION TIME
                    voiceDetectionTimeRef.current = Date.now();
                    console.log('🎤 [VOICE DETECTED] Starting recording...');

                    isProcessing = true;
                    audioChunks = [];

                    try {
                        mediaRecorderRef.current.start(100);

                        //   TRACK RECORDING START TIME
                        recordingStartTimeRef.current = Date.now();
                        console.log(`📍 [RECORDING STARTED] at ${new Date(recordingStartTimeRef.current).toLocaleTimeString()}.${recordingStartTimeRef.current % 1000}`);

                        recordingTimer = setTimeout(() => {
                            if (mediaRecorderRef.current.state === 'recording') {
                                //   LOG SCHEDULED STOP TIME
                                console.log(`⏰ [CHUNK TIMER] ${CHUNK_DURATION}ms reached, stopping in 200ms...`);

                                setTimeout(() => {
                                    mediaRecorderRef.current.stop();
                                }, 300);
                            }
                        }, CHUNK_DURATION);

                    } catch (error) {
                        console.error('✗ Start failed:', error);
                        isProcessing = false;
                    }
                } else if (speaking) {
                    // Voice detected but can't start - log why
                    const state = mediaRecorderRef.current.state;
                    if (state !== 'inactive') {
                        console.log(`⚠️ [BLOCKED] Voice detected but recorder state is '${state}'`);
                    }
                    if (isProcessing) {
                        console.log(`⚠️ [BLOCKED] Voice detected but isProcessing=${isProcessing}`);
                    }
                }
            }

            //   CRITICAL: Always schedule next frame IMMEDIATELY
            animationFrameId = requestAnimationFrame(checkVoiceActivity);
        }

        // Start the loop
        animationFrameId = requestAnimationFrame(checkVoiceActivity);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            //   CALCULATE RECORDING DURATION
            if (recordingStartTimeRef.current) {
                const recordingDuration = Date.now() - recordingStartTimeRef.current;
                console.log(`[RECORDING STOPPED] Duration: ${recordingDuration}ms`);

                // Calculate total time from voice detection to stop
                if (voiceDetectionTimeRef.current) {
                    const totalDetectionTime = Date.now() - voiceDetectionTimeRef.current;
                    console.log(` [TOTAL DETECTION TIME] ${totalDetectionTime}ms from voice detected to recording stopped`);
                }
            }

            if (recordingTimer) {
                clearTimeout(recordingTimer);
                recordingTimer = null;
            }

            if (audioChunks.length === 0 || isMutedRef.current) {
                audioChunks = [];
                isProcessing = false;  // FIXED: Set immediately, not in setTimeout
                console.log(`🔓 [PROCESSING UNLOCKED] Ready for next recording`);
                return;
            }

            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

            //   LOG BLOB SIZE AND PROCESSING START
            const processingStartTime = Date.now();
            console.log(` [BLOB CREATED] Size: ${audioBlob.size} bytes`);

            // CRITICAL FIX: Reset IMMEDIATELY - don't delay with setTimeout
            isProcessing = false;
            console.log(`🔓 [PROCESSING UNLOCKED] Ready for next recording`);

            if (audioBlob.size > 5000) {
                //   Send in background - don't wait
                const sendTime = Date.now();
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1];

                    //   LOG ENCODING TIME
                    const encodingTime = Date.now() - processingStartTime;
                    console.log(`  [BASE64 ENCODED] Encoding took: ${encodingTime}ms`);

                    if (socketRef.current?.connected) {
                        //   LOG SENDING TIME
                        console.log(`  [SENDING AUDIO] at ${new Date(sendTime).toLocaleTimeString()}.${sendTime % 1000}`);

                        socketRef.current.emit('audio_stream', {
                            audio_data: base64Audio,
                            accent: currentAccent,
                            gender: currentGender,
                            timestamp: sendTime
                        });

                        //   CALCULATE TOTAL PROCESSING TIME
                        const totalProcessingTime = Date.now() - recordingStartTimeRef.current;
                        console.log(`  [SENT TO SERVER] Total local processing: ${totalProcessingTime}ms`);

                        // Store in array for averaging
                        processingTimesRef.current.push(totalProcessingTime);
                        if (processingTimesRef.current.length > 10) {
                            processingTimesRef.current.shift(); // Keep only last 10
                        }

                        // Calculate average
                        const avgProcessingTime = Math.round(
                            processingTimesRef.current.reduce((a, b) => a + b, 0) / processingTimesRef.current.length
                        );
                        console.log(` [AVERAGE PROCESSING] ${avgProcessingTime}ms (last ${processingTimesRef.current.length} chunks)`);

                        //   CRITICAL: Update stats in next tick to avoid blocking
                        setTimeout(() => {
                            setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
                        }, 0);
                    }
                };

                reader.readAsDataURL(audioBlob);
            } else {
                console.log(`[SKIPPED] Audio too small: ${audioBlob.size} bytes`);
            }

            audioChunks = [];
        };

        mediaRecorderRef.current.onerror = (event) => {
            console.error('MediaRecorder error:', event.error);
            isProcessing = false;
            if (recordingTimer) {
                clearTimeout(recordingTimer);
                recordingTimer = null;
            }
        };

        console.log(' Voice Detection active');

        //   Return cleanup function
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    };

    const queueAudio = (audioData) => {
        const queueTime = Date.now();
        audioQueueRef.current.push({ ...audioData, queueTime });
        console.log(` [QUEUED] Position ${audioQueueRef.current.length} in queue`);

        if (!isPlayingAudioRef.current) {
            console.log(' [QUEUE PROCESSING] Starting queue processing...');
            processAudioQueue();
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const processAudioQueue = async () => {
        if (audioQueueRef.current.length === 0) {
            isPlayingAudioRef.current = false;
            console.log(' [QUEUE EMPTY] Queue processing stopped');
            return;
        }

        isPlayingAudioRef.current = true;
        const audioData = audioQueueRef.current.shift();

        //   LOG QUEUE WAIT TIME
        if (audioData.queueTime) {
            const queueWaitTime = Date.now() - audioData.queueTime;
            console.log(` [DEQUEUED] Waited in queue: ${queueWaitTime}ms`);
        }

        try {
            const playStartTime = Date.now();
            await playAudioChunk(audioData);
            const playDuration = Date.now() - playStartTime;

            //   LOG PLAYBACK DURATION
            console.log(` [PLAYBACK COMPLETE] Duration: ${playDuration}ms`);

            // Calculate latency
            if (audioData.timestamp && audioData.receivedTime) {
                const latency = audioData.receivedTime - audioData.timestamp;

                //   LOG DETAILED LATENCY
                console.log(` [LATENCY BREAKDOWN]`);
                console.log(`   • Network transit: ${latency}ms`);
                console.log(`   • Queue wait: ${audioData.queueTime ? Date.now() - audioData.queueTime : 'N/A'}ms`);
                console.log(`   • Playback: ${playDuration}ms`);
                console.log(`   • Total E2E: ${Date.now() - audioData.timestamp}ms`);

                setStats(prev => ({
                    ...prev,
                    latency: Math.round(latency)
                }));
            }

            if (audioQueueRef.current.length > 0) {
                console.log(` [PAUSE] Adding ${NATURAL_PAUSE_MS}ms pause before next audio`);
                await sleep(NATURAL_PAUSE_MS); //   450ms pause between chunks
            }

            processAudioQueue();

        } catch (error) {
            console.error('  [PLAY ERROR]:', error);
            await sleep(NATURAL_PAUSE_MS);
            processAudioQueue();
        }
    };

    //   Play Audio Chunk - WEB AUDIO API (MATCHED TO HTML)
    const playAudioChunk = (audioData) => {
        return new Promise(async (resolve, reject) => {
            const startTime = Date.now();

            try {
                console.log(`🎵 [PLAYING] Audio from: ${audioData.username}`);

                // Highlight speaker
                const participantCard = document.querySelector(`[data-username="${audioData.username}"]`);
                if (participantCard) {
                    participantCard.classList.add('speaking');
                }

                // Decode Base64 to ArrayBuffer
                const decodeStartTime = Date.now();
                const raw = atob(audioData.audio_data);
                const arrayBuffer = new ArrayBuffer(raw.length);
                const view = new Uint8Array(arrayBuffer);
                for (let i = 0; i < raw.length; i++) {
                    view[i] = raw.charCodeAt(i);
                }

                //   LOG BASE64 DECODE TIME
                console.log(` [BASE64 DECODED] ${Date.now() - decodeStartTime}ms`);

                //   Decode to audio buffer using Web Audio API
                const audioDecodeStart = Date.now();
                const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

                //   LOG AUDIO DECODE TIME
                console.log(` [AUDIO DECODED] ${Date.now() - audioDecodeStart}ms, Duration: ${audioBuffer.duration.toFixed(2)}s`);

                //   Create buffer source for playback
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);

                //   Schedule to play immediately after last chunk - NO GAP
                const now = audioContextRef.current.currentTime;
                if (playHeadTimeRef.current < now) {
                    playHeadTimeRef.current = now;
                }

                source.start(playHeadTimeRef.current);

                //   LOG SCHEDULED PLAYBACK TIME
                const scheduledDelay = (playHeadTimeRef.current - now) * 1000;
                console.log(` [SCHEDULED] Playing with ${scheduledDelay.toFixed(1)}ms delay for gapless playback`);

                playHeadTimeRef.current += audioBuffer.duration;

                source.onended = () => {
                    const totalPlayTime = Date.now() - startTime;
                    console.log(`  [PLAYBACK ENDED] Total play time: ${totalPlayTime}ms`);

                    if (participantCard) {
                        participantCard.classList.remove('speaking');
                    }
                    resolve();
                };

            } catch (err) {
                console.error("  [PLAY AUDIO ERROR]:", err);
                resolve();
            }
        });
    };

    // Toggle Mute
    const handleMicToggle = () => {
        const newMutedState = !isListening;
        setIsListening(newMutedState);
        isMutedRef.current = newMutedState;

        console.log(` [MIC TOGGLE] ${newMutedState ? 'MUTED' : 'UNMUTED'}`);

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('toggle_mute', { muted: newMutedState });
        }
    };

    const handleEndCall = () => {
        console.log(' [ENDING CALL]...');

        //   LOG FINAL STATISTICS
        if (processingTimesRef.current.length > 0) {
            console.log(' [FINAL STATS]');
            console.log(`   • Total chunks sent: ${stats.sent}`);
            console.log(`   • Total chunks received: ${stats.received}`);
            console.log(`   • Average processing time: ${Math.round(
                processingTimesRef.current.reduce((a, b) => a + b, 0) / processingTimesRef.current.length
            )}ms`);
            console.log(`   • Average latency: ${stats.latency}ms`);
        }

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('leave_room', { room_code: roomCode });
            socketRef.current.disconnect();
        }

        navigate(-1);
    };

    const handleShare = () => {
        const shareLink = `${window.location.origin}/accent/room/${roomCode}`;

        navigator.clipboard.writeText(shareLink).then(() => {
            console.log(` [LINK COPIED] ${shareLink}`);
            alert("Room link copied! Share it with others to invite them to the call.");
        }).catch(err => {
            console.error('   Copy failed:', err);
        });
    };

    const handleLike = () => {
        const newHandState = !handRaised;
        setHandRaised(newHandState);

        console.log(` [HAND ${newHandState ? 'RAISED' : 'LOWERED'}]`);

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('raise_hand', { raised: newHandState });
        }
    };

    const handleAccentChange = (e) => {
        const newAccent = e.target.value;
        setCurrentAccent(newAccent);

        console.log(` [ACCENT CHANGED] ${newAccent}`);

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('change_accent', { accent: newAccent });
        }
    };

    const handleGenderChange = (gender) => {
        setCurrentGender(gender);

        console.log(` [GENDER CHANGED] ${gender}`);

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('change_gender', { gender: gender });
        }
    };

    return (
        <div
            className="h-screen bg-gray-50 flex flex-col lg:flex-row lg:ml-[240px] lg:mt-[50px] lg:mr-[235px] lg:w-[calc(100%-240px)] overflow-hidden px-4 lg:px-0 pt-4 lg:pt-0"
            style={{ fontFamily: "'Mia-Assistant-Vocal', sans-serif" }}
        >
            <div className="flex-1 flex flex-col">
                <div className="border-gray-200 px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 pt-16 lg:pt-4">
                    <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start order-2 lg:order-1">
                        <div className="relative inline-block">
                            <select
                                value={currentAccent}
                                onChange={handleAccentChange}
                                className="appearance-none px-3 lg:px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base cursor-pointer bg-white"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    color: "#333333",
                                    minWidth: "180px"
                                }}
                            >
                                {ACCENT_OPTIONS.map(accent => (
                                    <option key={accent.value} value={accent.value}>
                                        {accent.label}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center w-full lg:w-auto">
                        <h1
                            className="text-xl lg:text-3xl"
                            style={{
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                fontWeight: 700,
                                color: "#000000",
                            }}
                        >
                            Mia - Assistant Vocal
                        </h1>
                        <p className="text-sm lg:text-xl" style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            color: "#868686",
                        }}>
                            Room: {roomCode} • {isConnected ? '🟢' : '🔴'} •  {stats.latency}ms • ↑{stats.sent} ↓{stats.received}
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-6 lg:py-0">
                    <div className="relative w-full max-w-xl h-40 lg:h-64 flex items-center justify-center mb-6 lg:mb-8">
                        <svg className="w-full h-full" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                            <path d={`M 0 100 Q 100 ${70 + Math.sin(waveAnimation * 0.1) * 25} 200 100 T 400 100 T 600 100 T 800 100`} fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
                            <path d={`M 0 100 Q 100 ${60 + Math.sin(waveAnimation * 0.12 + 0.5) * 30} 200 100 T 400 100 T 600 100 T 800 100`} fill="none" stroke="url(#gradient2)" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
                            <path d={`M 0 100 Q 100 ${50 + Math.sin(waveAnimation * 0.15 + 1) * 35} 200 100 T 400 100 T 600 100 T 800 100`} fill="none" stroke="url(#gradient3)" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#38BDF8" />
                                    <stop offset="50%" stopColor="#A78BFA" />
                                    <stop offset="100%" stopColor="#F472B6" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#A78BFA" />
                                    <stop offset="50%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#FB923C" />
                                </linearGradient>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#60A5FA" />
                                    <stop offset="50%" stopColor="#C084FC" />
                                    <stop offset="100%" stopColor="#F9A8D4" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="text-center mb-6 lg:mb-8">
                        <div className="flex items-center justify-center gap-2">
                            <p
                                className="text-xl lg:text-3xl"
                                style={{ fontFamily: "'Turret Road', sans-serif", color: "#000000" }}
                            >
                                {isListening ? "Muted" : "Listening..."}
                            </p>
                            {!isListening && (
                                <Mic className="w-6 h-6 text-yellow-500" />
                            )}
                        </div>

                        {/* Hint appears only when muted */}
                        {isListening && (
                            <p className="text-sm text-gray-500 mt-2">
                                You’re muted — unmute yourself to speak.
                            </p>
                        )}
                    </div>


                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={handleMicToggle}
                            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-lg ${isListening ? "bg-gray-700 text-white hover:bg-gray-800" : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            title={isListening ? "Unmute" : "Mute"}
                        >
                            <Mic className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>

                        <button onClick={handleShare} className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg" title="Share">
                            <Share2 className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                        </button>

                        <button
                            onClick={handleLike}
                            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg ${handRaised ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            title={handRaised ? "Lower Hand" : "Raise Hand"}
                        >
                            <Hand className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>

                        <button onClick={handleEndCall} className="w-12 h-12 lg:w-14 lg:h-14 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-lg" title="Leave">
                            <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white rotate-[135deg]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 text-center p-4 lg:p-6 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 max-h-[50vh] lg:max-h-none overflow-y-auto">
                <div className="font-medium mb-4 lg:mb-5 text-sm lg:text-base" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span style={{ display: "inline-block", width: "1px", height: "24px", backgroundColor: "#000" }}></span>
                    <span style={{ fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: "25px" }}>
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="w-auto bg-white p-4 lg:p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Participants ({participants.length})</h3>
                    {participants.length === 0 ? (
                        <p className="text-gray-500 py-8">Waiting for participants...</p>
                    ) : (
                        <div className="space-y-4">
                            {participants.map((participant, index) => (
                                <div
                                    key={participant.sid || index}
                                    data-username={participant.username}
                                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg transition-all"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                            {participant.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900">
                                            {participant.username}{participant.username === username && ' (You)'}
                                        </p>
                                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                                            <span className={`text-xs px-2 py-1 rounded ${participant.muted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {participant.muted ? '🔇' : '🔊'}
                                            </span>
                                            {participant.hand_raised && <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">✋</span>}
                                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">🗣️ {participant.accent}</span>
                                            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">{participant.gender === 'female' ? '👩' : '👨'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                [data-username].speaking {
                    background: #e8f5e9 !important;
                    border: 2px solid #4caf50;
                    animation: pulse 1s ease-in-out;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `}</style>
        </div>
    );
};

export default VoiceConversation;