import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Mic, Share2, Hand, Phone, MicOff, Crown, User } from "lucide-react";
import io from "socket.io-client";
import { getRoomDetailsThunk, leaveRoomThunk } from "../../features/roomSlice";
import { useDispatch } from "react-redux";
import RoomPreviewModal from "../RoomPreviewModal/RoomPreviewModal";



const VoiceConversation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // Backend URL - Updated for Azure STT integration
    const BACKEND_URL = "https://talkbrush.com/accent";
    // const BACKEND_URL = "http://127.0.0.1:4444/accent";

    const roomCode = params.roomCode || location.state?.roomCode || null;

    // Socket and Audio Refs
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const isMutedRef = useRef(true);
    const playHeadTimeRef = useRef(0);

    const recordingStartTimeRef = useRef(null);
    const voiceDetectionTimeRef = useRef(null);
    const processingTimesRef = useRef([]);
    const userProfilesRef = useRef({});

    // State Management
    const [isListening, setIsListening] = useState(true);
    const [waveAnimation, setWaveAnimation] = useState(0);
    const [currentAccent, setCurrentAccent] = useState('american');
    const [currentGender, setCurrentGender] = useState('male');
    const [handRaised, setHandRaised] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ sent: 0, received: 0, latency: 0 });
    const [roomDetails, setRoomDetails] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [userData, setUserData] = useState(null);

    //  Audio Queue System - matches backend processing
    const audioQueueRef = useRef([]);
    const isPlayingAudioRef = useRef(false);
    const NATURAL_PAUSE_MS = 450; // Matches room.js for consistent playback

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

    useEffect(() => {
        if (roomCode) {
            dispatch(getRoomDetailsThunk(roomCode)).then((response) => {
                if (response.payload) {
                    setRoomDetails(response.payload);
                    setUsername(response.payload.initiator_name);

                    setUserData({
                        username: response.payload.initiator_name,
                        user_id: response.payload.initiator_id
                    });

                    const profilesMap = {};
                    response.payload.members.forEach(member => {
                        profilesMap[member.user_id] = member.profile_image;
                    });
                    userProfilesRef.current = profilesMap;

                    const apiParticipants = response.payload.members.map(member => ({
                        username: member.username,
                        sid: member.user_id,
                        profile_image: member.profile_image,
                        muted: true,
                        hand_raised: false,
                        accent: 'american',
                        gender: 'male'
                    }));
                    setParticipants(apiParticipants);
                }
            });
        }
    }, [dispatch, roomCode]);


    useEffect(() => {
        console.log('🔍 Join check:', { isConnected, userData, roomCode }); // ✅ ADD THIS

        if (isConnected && userData && roomCode && socketRef.current) {
            console.log('✅ Joining room with user:', userData.username, 'ID:', userData.user_id); // ✅ IMPROVED
            socketRef.current.emit('join_room', {
                room_code: roomCode,
                username: userData.username,
                user_id: userData.user_id
            });
        }
    }, [isConnected, userData, roomCode]);

    useEffect(() => {
        const checkAuthAndShowModal = () => {
            const cameFromShare = !location.state?.fromCreateRoom;
            const hasJoinedRoom = sessionStorage.getItem(`joined_${roomCode}`);

            if (cameFromShare && !hasJoinedRoom) {
                setShowPreviewModal(true);
            }

            setIsCheckingAuth(false);
        };

        if (roomCode && roomDetails) {
            checkAuthAndShowModal();
        }
    }, [roomCode, roomDetails, location.state, navigate]);

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
            navigate('/');
            return;
        }

        console.log('✅ Authenticated, joining room:', roomCode);
        console.log(' Connecting to:', BACKEND_URL);
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
            console.log('✅ Connected to server - SID:', socketRef.current.id);
            console.log('🔍 Current userData:', userData); // ✅ ADD THIS
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('   Disconnected:', reason);
            setIsConnected(false);
        });

        //   NEW - Handle reconnection
        socketRef.current.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);
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
            console.log('👤 User joined:', data);

            // ✅ Fetch latest API data
            dispatch(getRoomDetailsThunk(roomCode)).then((response) => {
                if (response.payload) {
                    // Update profiles ref
                    response.payload.members.forEach(member => {
                        userProfilesRef.current[member.user_id] = member.profile_image;
                    });

                    // ✅ IMPROVED: Keep existing participants and update their status
                    setParticipants(prevParticipants => {
                        // Get all API users
                        const apiUserIds = response.payload.members.map(m => m.user_id);

                        // Get all socket user IDs
                        const socketUserIds = data.participants.map(p => p.sid);

                        // Build updated participant list
                        const updatedParticipants = apiUserIds.map(userId => {
                            // Find socket data for this user
                            const socketData = data.participants.find(p => p.sid === userId);

                            // Find existing participant data
                            const existingParticipant = prevParticipants.find(p => p.sid === userId);

                            // Find API data
                            const apiUser = response.payload.members.find(m => m.user_id === userId);

                            // Merge all data sources (priority: socket > existing > api)
                            return {
                                username: apiUser.username,
                                sid: userId,
                                profile_image: apiUser.profile_image,
                                muted: socketData ? socketData.muted : (existingParticipant ? existingParticipant.muted : true),
                                hand_raised: socketData ? socketData.hand_raised : (existingParticipant ? existingParticipant.hand_raised : false),
                                accent: socketData?.accent || existingParticipant?.accent || 'american',
                                gender: socketData?.gender || existingParticipant?.gender || 'male'
                            };
                        });

                        console.log('✅ Updated participants:', updatedParticipants);
                        return updatedParticipants;
                    });
                }
            });
        });

        socketRef.current.on('user_left', (data) => {
            console.log('👋 User left:', data);

            const leftUserId = data.user_id || data.sid;

            setParticipants(prevParticipants =>
                prevParticipants.filter(p => p.sid !== leftUserId)
            );

            console.log('✅ Removed user with ID:', leftUserId);
        });
        socketRef.current.on('mute_status_changed', (data) => {
            console.log(' Mute status changed:', data);
            setParticipants(prevParticipants => {
                return prevParticipants.map(participant => {
                    const socketParticipant = data.participants.find(p => p.sid === participant.sid);
                    return socketParticipant ? {
                        ...participant,
                        muted: socketParticipant.muted
                    } : participant;
                });
            });
        });

        socketRef.current.on('hand_status_changed', (data) => {
            console.log(' Hand status changed:', data);
            setParticipants(prevParticipants => {
                return prevParticipants.map(participant => {
                    const socketParticipant = data.participants.find(p => p.sid === participant.sid);
                    return socketParticipant ? {
                        ...participant,
                        hand_raised: socketParticipant.hand_raised
                    } : participant;
                });
            });
        });

        socketRef.current.on('receive_audio', (data) => {
            const receiveTime = Date.now();
            console.log(`📥 [RECEIVED] Audio from: ${data.username}`);

            //   LOG END-TO-END LATENCY
            if (data.timestamp) {
                const endToEndLatency = receiveTime - data.timestamp;
                console.log(`⏱ [E2E LATENCY] ${endToEndLatency}ms from sender to receiver`);
            }

            data.receivedTime = receiveTime;
            setStats(prev => ({ ...prev, received: prev.received + 1 }));
            queueAudio(data);
        });

        socketRef.current.on('streaming_started', () => {
            console.log('✅ [STREAMING] Azure STT session started');
        });

        socketRef.current.on('streaming_stopped', () => {
            console.log('⏹️ [STREAMING] Azure STT session stopped');
        });

        requestMicrophoneAccess();

        return () => {
            if (socketRef.current) {
                socketRef.current.off('connect');
                socketRef.current.off('disconnect');
                socketRef.current.off('user_joined');
                socketRef.current.off('user_left');
                socketRef.current.off('mute_status_changed');
                socketRef.current.off('hand_status_changed');
                socketRef.current.off('receive_audio');
                socketRef.current.off('streaming_started');
                socketRef.current.off('streaming_stopped');

                socketRef.current.emit('leave_room', { room_code: roomCode });
                socketRef.current.disconnect();
            }

            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [roomCode, navigate, dispatch]);

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

    //   AZURE STREAMING MODE - Continuous audio streaming for real-time STT
    //   AZURE STREAMING MODE - Continuous audio streaming for real-time STT
    const setupMediaRecorder = (stream) => {
        console.log('🎙️ [SETUP] Azure Streaming Mode (200ms chunks)...');

        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        });

        // Streaming mode: send small chunks continuously (200ms)
        const CHUNK_INTERVAL = 200; // Very small chunks for real-time Azure STT
        let audioChunks = [];
        let streamingSessionStarted = false;
        let isRestarting = false; // ✅ NEW: Prevent concurrent restart attempts

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            if (audioChunks.length > 0 && !isMutedRef.current) {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

                if (audioBlob.size > 1000) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Audio = reader.result.split(',')[1];

                        // Send streaming chunk to Azure STT backend
                        socketRef.current.emit('audio_stream_chunk', {
                            audio_data: base64Audio
                        });

                        setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
                        console.log(`📤 [SENT CHUNK] ${audioBlob.size} bytes`);
                    };
                    reader.readAsDataURL(audioBlob);
                }
            }
            audioChunks = [];

            // ✅ REMOVED: Don't restart here - let the interval handle it
            // This was causing the conflict!
        };

        // ✅ IMPROVED: Single source of truth for recording management
        const streamingInterval = setInterval(() => {
            // Only proceed if not already in a restart operation
            if (isRestarting) return;

            if (!isMutedRef.current) {
                // Start streaming session if not started
                if (!streamingSessionStarted) {
                    socketRef.current.emit('start_streaming', {});
                    streamingSessionStarted = true;
                    console.log('▶️ [STREAMING] Session started');
                }

                // ✅ FIXED: Better state checking before starting
                if (mediaRecorderRef.current.state === 'inactive') {
                    isRestarting = true; // ✅ Set flag to prevent concurrent attempts

                    try {
                        mediaRecorderRef.current.start();

                        // Stop after CHUNK_INTERVAL
                        setTimeout(() => {
                            if (mediaRecorderRef.current.state === 'recording') {
                                mediaRecorderRef.current.stop();
                            }
                            isRestarting = false; // ✅ Reset flag after stop
                        }, CHUNK_INTERVAL);

                    } catch (e) {
                        console.error('⚠️ [START ERROR]:', e);
                        isRestarting = false; // ✅ Reset flag on error
                    }
                }
            } else if (isMutedRef.current) {
                // Stop recording if muted
                if (mediaRecorderRef.current.state === 'recording') {
                    try {
                        mediaRecorderRef.current.stop();
                    } catch (e) {
                        console.error('⚠️ [STOP ERROR]:', e);
                    }
                }


                if (streamingSessionStarted) {
                    socketRef.current.emit('stop_streaming');
                    streamingSessionStarted = false;
                    console.log('⏹️ [STREAMING] Session stopped');
                }

                isRestarting = false;
            }
        }, 50);

        console.log('✅ [READY] Azure streaming recorder initialized');

        return () => {
            clearInterval(streamingInterval);
            isRestarting = false;
        };
    };

    const queueAudio = (audioData) => {
        const isDuplicate = audioQueueRef.current.some(
            item => item.timestamp === audioData.timestamp &&
                item.username === audioData.username
        );

        if (isDuplicate) {
            console.log('⚠️ [DUPLICATE BLOCKED] Audio already in queue');
            return;
        }

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

        setParticipants(prev =>
            prev.map(p =>
                p.username === username ? { ...p, muted: newMutedState } : p
            )
        );

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('toggle_mute', { muted: newMutedState });
        }
    };

    const handleCloseModal = () => {
        setShowPreviewModal(false);
    };

    const handleJoinRoom = async () => {
        console.log('🔄 User joined via modal, refetching room details...');

        // ✅ Refetch room details to get updated members list
        const response = await dispatch(getRoomDetailsThunk(roomCode));

        if (response.payload) {
            console.log('✅ Room details refetched:', response.payload);

            // Update room details
            setRoomDetails(response.payload);

            // Update username if it changed
            setUsername(response.payload.initiator_name);

            setUserData({
                username: response.payload.initiator_name,
                user_id: response.payload.initiator_id
            });

            const profilesMap = {};
            response.payload.members.forEach(member => {
                profilesMap[member.user_id] = member.profile_image;
            });
            userProfilesRef.current = profilesMap;

            const apiParticipants = response.payload.members.map(member => ({
                username: member.username,
                sid: member.user_id,
                profile_image: member.profile_image,
                muted: true,
                hand_raised: false,
                accent: 'american',
                gender: 'male'
            }));
            setParticipants(apiParticipants);

            console.log('✅ Updated participants after join:', apiParticipants);
        }

        setShowPreviewModal(false);
    };

    const handleEndCall = () => {
        console.log(' [ENDING CALL]...');

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('leave_room', { room_code: roomCode });
            socketRef.current.disconnect();
        }

        dispatch(leaveRoomThunk(roomCode))
            .then(() => console.log('✅ Left room via API'))
            .catch(err => console.error('❌ Leave room API error:', err));

        navigate(-1);
    };

    const handleShare = () => {
        const shareLink = `${window.location.origin}/accent/room/${roomCode}`;

        navigator.clipboard.writeText(shareLink).then(() => {
            console.log(` [LINK COPIED] ${shareLink}`);
            const toast = document.createElement("div");
            toast.className =
                "fixed bottom-30 left-[40%] transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg text-sm z-[9999] opacity-0 transition-opacity duration-300";

            toast.innerText = "Link copied to clipboard";

            document.body.appendChild(toast);

            // Fade in
            setTimeout(() => {
                toast.style.opacity = "1";
            }, 10);

            // Remove after fade-out
            setTimeout(() => {
                toast.style.opacity = "0";
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }).catch(err => {
            console.error('   Copy failed:', err);
        });
    };

    const handleLike = () => {
        const newHandState = !handRaised;
        setHandRaised(newHandState);

        console.log(` [HAND ${newHandState ? 'RAISED' : 'LOWERED'}]`);

        setParticipants(prev =>
            prev.map(p =>
                p.username === username ? { ...p, hand_raised: newHandState } : p
            )
        );

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
        setParticipants(prev =>
            prev.map(p =>
                p.username === username ? { ...p, accent: newAccent } : p
            )
        );
    };

    const handleGenderChange = (gender) => {
        setCurrentGender(gender);

        console.log(` [GENDER CHANGED] ${gender}`);

        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('change_gender', { gender: gender });
        }
    };

    return (

        <>
            {showPreviewModal && (
                <RoomPreviewModal
                    roomCode={roomCode}
                    roomDetails={roomDetails}
                    onClose={handleCloseModal}
                    onContinue={handleJoinRoom}
                />
            )}
            {!isCheckingAuth && (
                <div
                    className="h-screen bg-gray-50 flex flex-col lg:flex-row lg:ml-[240px] lg:mt-[50px] lg:mr-[235px] lg:w-[calc(100%-240px)] overflow-hidden px-4 lg:px-0 pt-4 lg:pt-0"
                    style={{ fontFamily: "'Mia-Assistant-Vocal', sans-serif" }}
                >
                    <div className="flex-1 flex flex-col">
                        <div className="border-gray-200 px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 pt-16 lg:pt-4">
                            <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start order-2 lg:order-1">
                                <div className="inline-block">
                                    <p className="text-xs text-center w-full text-gray-500 mb-1 ml-1">
                                        Change your accent
                                    </p>
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
                            </div>

                            <div className="flex-1 text-center w-full lg:w-auto mt-4">

                                {/* Better heading */}
                                <h1
                                    className="text-xl lg:text-3xl"
                                    style={{
                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                        fontWeight: 700,
                                        color: "#000",
                                    }}
                                >
                                    Accent Talk Room
                                </h1>

                                {/* Premium subtitle */}
                                <p
                                    className="text-sm lg:text-lg flex flex-wrap justify-center gap-2 mt-1"
                                    style={{
                                        fontFamily: "'Hanken Grotesk', sans-serif",
                                        color: "#6d6d6d",
                                    }}
                                >
                                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                                        Room • {roomCode.match(/.{1,3}/g).join("-")}
                                    </span>

                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                        {isConnected ? "🟢 Live" : "🔴 Offline"}
                                    </span>

                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                        {stats.latency}ms
                                    </span>

                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                        ↑{stats.sent} ↓{stats.received}
                                    </span>
                                </p>

                            </div>

                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-6 lg:py-0">
                            <div className="relative w-full max-w-xl h-40 lg:h-64 flex items-center justify-center mb-6 lg:mb-8 overflow-hidden">
                                <div
                                    className="relative h-full flex"
                                    style={{
                                        animation: !isListening ? 'scrollRightToLeft 8s linear infinite' : 'none',
                                        transform: isListening ? 'translateX(0)' : undefined
                                    }}
                                >
                                    {/* First copy of image */}
                                    <img
                                        src="/line.png"
                                        alt="Audio waves"
                                        className="h-full object-contain flex-shrink-0 transition-opacity duration-300"
                                        style={{
                                            minWidth: '100%',
                                            opacity: isListening ? 0.7 : 0.9
                                        }}
                                    />

                                    {/* Second copy for seamless loop */}
                                    <img
                                        src="/line.png"
                                        alt="Audio waves"
                                        className="h-full object-contain flex-shrink-0 transition-opacity duration-300"
                                        style={{
                                            minWidth: '100%',
                                            opacity: isListening ? 0.7 : 0.9
                                        }}
                                    />
                                </div>
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
                                    {/* HOST SECTION */}
                                    {roomDetails && participants.filter(p => p.sid === roomDetails.initiator_id).length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3 px-2">
                                                <Crown className="w-4 h-4 text-yellow-600" />
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Host</h4>
                                            </div>
                                            {participants
                                                .filter(p => p.sid === roomDetails.initiator_id)
                                                .map((participant, index) => {
                                                    const displayImage = participant.profile_image ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.username)}&background=random&size=128`;

                                                    return (
                                                        <div
                                                            key={participant.sid || index}
                                                            data-username={participant.username}
                                                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl transition-all border-2 border-blue-200"
                                                        >
                                                            <div className="relative flex-shrink-0">
                                                                <img
                                                                    src={displayImage}
                                                                    alt={participant.username}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-sm"
                                                                    onError={(e) => {
                                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.username)}&background=random&size=128`;
                                                                    }}
                                                                />
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                                        {participant.username}
                                                                    </p>
                                                                    {participant.username === username && (
                                                                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-start gap-1.5 mt-1.5">
                                                                    {/* Column 1: Mute Status */}
                                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap ${participant.muted
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : 'bg-green-100 text-green-700'
                                                                        }`}>
                                                                        {participant.muted ? (
                                                                            <MicOff className="w-2.5 h-2.5" />
                                                                        ) : (
                                                                            <Mic className="w-2.5 h-2.5" />
                                                                        )}
                                                                        <span>{participant.muted ? 'Muted' : 'Live'}</span>
                                                                    </div>

                                                                    {/* Column 2: Hand + Accent stacked */}
                                                                    <div className="flex flex-col gap-1">
                                                                        {/* Hand Raised */}
                                                                        {participant.hand_raised && (
                                                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-yellow-100 text-yellow-700 whitespace-nowrap">
                                                                                <Hand className="w-2.5 h-2.5" />
                                                                                <span>Raised</span>
                                                                            </div>
                                                                        )}

                                                                        {/* Accent */}
                                                                        <div className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-100 text-blue-700 capitalize whitespace-nowrap">
                                                                            {participant.accent.replace('_', ' ')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}

                                    {/* PARTICIPANTS SECTION */}
                                    {roomDetails && participants.filter(p => p.sid !== roomDetails.initiator_id).length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3 px-2">
                                                <User className="w-4 h-4 text-gray-600" />
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    Members ({participants.filter(p => p.sid !== roomDetails.initiator_id).length})
                                                </h4>
                                            </div>
                                            <div className="space-y-2">
                                                {participants
                                                    .filter(p => p.sid !== roomDetails.initiator_id)
                                                    .map((participant, index) => {
                                                        const displayImage = participant.profile_image ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.username)}&background=random&size=128`;

                                                        return (
                                                            <div
                                                                key={participant.sid || index}
                                                                data-username={participant.username}
                                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl transition-all hover:bg-gray-100 border border-gray-200"
                                                            >
                                                                <div className="relative flex-shrink-0">
                                                                    <img
                                                                        src={displayImage}
                                                                        alt={participant.username}
                                                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                                                                        onError={(e) => {
                                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.username)}&background=random&size=128`;
                                                                        }}
                                                                    />
                                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                                            {participant.username}
                                                                        </p>
                                                                        {participant.username === username && (
                                                                            <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">You</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-start gap-1.5 mt-1.5">
                                                                        {/* Column 1: Mute Status */}
                                                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap ${participant.muted
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-green-100 text-green-700'
                                                                            }`}>
                                                                            {participant.muted ? (
                                                                                <MicOff className="w-2.5 h-2.5" />
                                                                            ) : (
                                                                                <Mic className="w-2.5 h-2.5" />
                                                                            )}
                                                                            <span>{participant.muted ? 'Muted' : 'Live'}</span>
                                                                        </div>

                                                                        {/* Column 2: Hand + Accent stacked */}
                                                                        <div className="flex flex-col gap-1">
                                                                            {/* Hand Raised */}
                                                                            {participant.hand_raised && (
                                                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-yellow-100 text-yellow-700 whitespace-nowrap">
                                                                                    <Hand className="w-2.5 h-2.5" />
                                                                                    <span>Raised</span>
                                                                                </div>
                                                                            )}

                                                                            {/* Accent */}
                                                                            <div className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-100 text-purple-700 capitalize whitespace-nowrap">
                                                                                {participant.accent.replace('_', ' ')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <style>{`
                [data-username].speaking {
                    background: #e8f5e9 !important;
                    border: 2px solid #4caf50;
                    animation: pulse 1s ease-in-out;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                    @keyframes scrollRightToLeft {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}
            `}</style>
                </div>
            )}
        </>
    );
};

export default VoiceConversation;