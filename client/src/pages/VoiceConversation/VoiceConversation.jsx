import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Mic, Share2, Hand, Phone, MicOff, Crown, User, Video, VideoOff } from "lucide-react";
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

    // Debug: Log environment variables
    console.log('🔧 Environment Check:');
    console.log('  VITE_Python_API_BASE_URL:', import.meta.env.VITE_Python_API_BASE_URL);
    console.log('  Final BACKEND_URL:', BACKEND_URL);

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
    const hasJoinedRoomRef = useRef(false); // Track if already joined to prevent duplicates

    // Video Refs
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionsRef = useRef({});
    const remoteVideosRef = useRef({});

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
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [remoteStreams, setRemoteStreams] = useState({});

    //  Audio Queue System - matches backend processing
    const audioQueueRef = useRef([]);
    const isPlayingAudioRef = useRef(false);
    const recentlyPlayedRef = useRef([]); // Track recently played to prevent duplicates
    const NATURAL_PAUSE_MS = 450; // Matches room.js for consistent playback
    const DUPLICATE_WINDOW_MS = 10000; // 10 second window for duplicate detection

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

                    // ✅ FIXED: Get current user's ID from localStorage
                    const currentUserId = localStorage.getItem('userId');

                    console.log('🔍 DEBUG: Looking for current user...');
                    console.log('🔍 localStorage userId:', currentUserId);
                    console.log('🔍 Members from API:', response.payload.members.map(m => ({
                        user_id: m.user_id,
                        username: m.username
                    })));

                    // Find the current logged-in user in the members list
                    const currentUser = response.payload.members.find(
                        member => String(member.user_id) === String(currentUserId)
                    );

                    let newUserData;
                    if (currentUser) {
                        // User is a member of this room
                        newUserData = {
                            username: currentUser.username,
                            user_id: currentUser.user_id
                        };
                        setUsername(currentUser.username);
                        console.log('✅ Current user found:', currentUser.username, currentUser.user_id);
                    } else {
                        // Fallback: user might be the initiator or not in members yet
                        newUserData = {
                            username: response.payload.initiator_name,
                            user_id: response.payload.initiator_id
                        };
                        setUsername(response.payload.initiator_name);
                        console.log('⚠️ Using initiator as fallback:', response.payload.initiator_name);
                        console.log('⚠️ No match found for userId:', currentUserId);
                    }

                    setUserData(newUserData);

                    console.log('✅ ===== USER DATA LOADED =====');
                    console.log('  username:', newUserData.username);
                    console.log('  user_id:', newUserData.user_id);
                    console.log('  Socket connected:', !!socketRef.current?.connected);
                    console.log('==============================');

                    // ✅ If socket is already connected, emit join_room immediately
                    if (socketRef.current && socketRef.current.connected && !hasJoinedRoomRef.current) {
                        console.log('✅ Socket already connected, emitting join_room now');
                        socketRef.current.emit('join_room', {
                            room_code: roomCode,
                            username: newUserData.username,
                            user_id: newUserData.user_id
                        });
                        hasJoinedRoomRef.current = true;
                    }

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
        console.log('🔍 ===== JOIN CHECK =====');
        console.log('  isConnected:', isConnected);
        console.log('  userData:', userData);
        console.log('  roomCode:', roomCode);
        console.log('  socketRef.current:', !!socketRef.current);

        if (isConnected && userData && roomCode && socketRef.current && !hasJoinedRoomRef.current) {
            console.log('✅ ===== EMITTING JOIN_ROOM =====');
            console.log('  username:', userData.username);
            console.log('  user_id:', userData.user_id);
            console.log('  room_code:', roomCode);

            socketRef.current.emit('join_room', {
                room_code: roomCode,
                username: userData.username,
                user_id: userData.user_id
            });

            hasJoinedRoomRef.current = true;

            console.log('✅ join_room event emitted');
            console.log('======================');
        } else {
            console.log('⚠️  Cannot join room yet - missing:');
            if (!isConnected) console.log('   ❌ Socket not connected');
            if (!userData) console.log('   ❌ User data not available');
            if (!roomCode) console.log('   ❌ Room code not available');
            if (!socketRef.current) console.log('   ❌ Socket ref not initialized');
        }
        console.log('======================');
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
        console.log('🔌 Connecting to:', BACKEND_URL);
        console.log('🔌 Socket path: /accent/socket.io/');
        console.log('🔌 Full URL will be:', `${BACKEND_URL}/socket.io/`);

        socketRef.current = io("https://talkbrush.com", {
            path: "/accent/socket.io/",
            transports: ["websocket", "polling"],
            withCredentials: true,
        });


        console.log('🔌 Socket instance created, auto-connecting...');
        console.log('🔌 Socket object:', socketRef.current);
        console.log('🔌 Socket ID (before connect):', socketRef.current.id);
        console.log('🔌 Socket connected (before connect):', socketRef.current.connected);

        // ✅ Add timeout to detect connection failures
        const connectionTimeout = setTimeout(() => {
            if (!socketRef.current?.connected) {
                console.error('⏰ ===== CONNECTION TIMEOUT =====');
                console.error('⏰ Socket failed to connect within 5 seconds');
                console.error('⏰ Socket state:', {
                    connected: socketRef.current?.connected,
                    disconnected: socketRef.current?.disconnected,
                    id: socketRef.current?.id,
                    transport: socketRef.current?.io?.engine?.transport?.name
                });
                console.error('================================');
            }
        }, 5000);




        socketRef.current.on('connect', () => {
            console.log('✅ ===== SOCKET CONNECTED =====');
            console.log('✅ Connected to server - SID:', socketRef.current.id);
            console.log('🔍 Current userData:', userData);
            console.log('🔍 Socket URL:', socketRef.current.io.uri);
            console.log('✅ ===========================');

            // Clear connection timeout
            clearTimeout(connectionTimeout);

            // Force set connected state
            setIsConnected(true);

            // ✅ IMMEDIATELY emit join_room after connection
            if (userData && roomCode && !hasJoinedRoomRef.current) {
                console.log('✅ ===== IMMEDIATELY EMITTING JOIN_ROOM =====');
                console.log('  username:', userData.username);
                console.log('  user_id:', userData.user_id);
                console.log('  room_code:', roomCode);

                socketRef.current.emit('join_room', {
                    room_code: roomCode,
                    username: userData.username,
                    user_id: userData.user_id
                });

                hasJoinedRoomRef.current = true;

                console.log('✅ join_room event emitted immediately after connect');
                console.log('======================');
            }
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('❌ ===== CONNECTION ERROR =====');
            console.error('❌ Full error object:', error);
            console.error('❌ Error stringified:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            console.error('❌ Error message:', error?.message);
            console.error('❌ Error type:', error?.type);
            console.error('❌ Error description:', error?.description);
            console.error('❌ Error data:', error?.data);
            console.error('❌ Error context:', error?.context);
            console.error('❌ Trying to connect to:', BACKEND_URL);
            console.error('❌ Socket path:', '/accent/socket.io/');
            console.error('❌ Socket transport:', socketRef.current?.io?.opts?.transports);
            console.error('❌ Current transport:', socketRef.current?.io?.engine?.transport?.name);
            console.error('❌ Error stack:', error?.stack);
            console.error('==============================');
            setIsConnected(false);

            // Try to show user-friendly error
            if (error?.message) {
                console.error(`💡 Suggestion: ${getErrorSuggestion(error.message)}`);
            }
        });

        // Helper function to provide error suggestions
        function getErrorSuggestion(errorMessage) {
            if (errorMessage.includes('timeout')) {
                return 'The server is not responding. Please check if the backend server is running on port 4444.';
            } else if (errorMessage.includes('CORS')) {
                return 'CORS error detected. The backend server may not be configured to accept requests from this origin.';
            } else if (errorMessage.includes('Network')) {
                return 'Network error. Please check your internet connection or if the backend server is accessible.';
            }
            return 'Unknown error. Please check the console logs for more details.';
        }

        // Add listener for ANY error event
        socketRef.current.onAny((eventName, ...args) => {
            console.log(`📨 [SOCKET EVENT] ${eventName}:`, args);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('🔌 Disconnected:', reason);
            setIsConnected(false);
            hasJoinedRoomRef.current = false; // Reset flag on disconnect
        });

        //   Handle reconnection
        socketRef.current.on('reconnect', (attemptNumber) => {
            console.log('🔄 Reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);

            // ✅ Re-join room after reconnection (reset flag for reconnection)
            if (userData && roomCode) {
                console.log('🔄 Re-joining room after reconnection...');
                hasJoinedRoomRef.current = false; // Reset flag to allow re-join
                socketRef.current.emit('join_room', {
                    room_code: roomCode,
                    username: userData.username,
                    user_id: userData.user_id
                });
                hasJoinedRoomRef.current = true;
            }
        });

        socketRef.current.on('reconnect_attempt', () => {
            console.log('🔄 Attempting to reconnect...');
        });

        socketRef.current.on('reconnect_error', (error) => {
            console.error('❌ Reconnection error:', error);
        });

        socketRef.current.on('reconnect_failed', () => {
            console.error('❌ Reconnection failed after all attempts');
            alert('Connection lost. Please refresh the page.');
        });

        // Handle custom 'error' event from backend (e.g., room not found)
        socketRef.current.on('error', (data) => {
            console.error('❌ Backend error event:', data);
            if (data && data.message) {
                alert('Error: ' + data.message);
            }
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
                    // Match by user_id instead of sid (sid changes on reconnect, user_id is stable)
                    const socketParticipant = data.participants.find(p => String(p.user_id) === String(participant.sid));
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
                console.log('🔍 [DEBUG] Current participants:', prevParticipants);
                console.log('🔍 [DEBUG] Socket participants:', data.participants);

                const updated = prevParticipants.map(participant => {
                    // Match by user_id instead of sid (sid changes on reconnect, user_id is stable)
                    const socketParticipant = data.participants.find(p => String(p.user_id) === String(participant.sid));

                    if (socketParticipant) {
                        console.log(`✅ [MATCH] Found match for ${participant.username} - hand_raised: ${socketParticipant.hand_raised}`);
                        return {
                            ...participant,
                            hand_raised: socketParticipant.hand_raised
                        };
                    } else {
                        console.log(`❌ [NO MATCH] No match for ${participant.username} (sid: ${participant.sid})`);
                        return participant;
                    }
                });

                console.log('✅ [UPDATED] New participants state:', updated);
                return updated;
            });
        });

        socketRef.current.on('accent_status_changed', (data) => {
            console.log('🗣 Accent status changed:', data);
            setParticipants(prevParticipants => {
                return prevParticipants.map(participant => {
                    // Match by user_id instead of sid (sid changes on reconnect, user_id is stable)
                    const socketParticipant = data.participants.find(p => String(p.user_id) === String(participant.sid));
                    return socketParticipant ? {
                        ...participant,
                        accent: socketParticipant.accent
                    } : participant;
                });
            });
        });

        socketRef.current.on('gender_status_changed', (data) => {
            console.log('👤 Gender status changed:', data);
            setParticipants(prevParticipants => {
                return prevParticipants.map(participant => {
                    // Match by user_id instead of sid (sid changes on reconnect, user_id is stable)
                    const socketParticipant = data.participants.find(p => String(p.user_id) === String(participant.sid));
                    return socketParticipant ? {
                        ...participant,
                        gender: socketParticipant.gender
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

        // Video event handlers
        socketRef.current.on('video_status_changed', (data) => {
            console.log('📹 Video status changed:', data);
            setParticipants(prevParticipants => {
                return prevParticipants.map(participant => {
                    // Match by user_id instead of sid (sid changes on reconnect, user_id is stable)
                    const socketParticipant = data.participants.find(p => String(p.user_id) === String(participant.sid));
                    return socketParticipant ? {
                        ...participant,
                        video_enabled: socketParticipant.video_enabled
                    } : participant;
                });
            });

            // If another user enabled video, request their stream
            if (data.video_enabled && data.user_sid !== socketRef.current.id) {
                console.log('📹 Requesting video from:', data.username);
            }
        });

        socketRef.current.on('video_request', async (data) => {
            console.log('📹 Video request from:', data.from_username);
            if (localStreamRef.current && videoEnabled) {
                await createPeerConnection(data.from_sid, true);
            }
        });

        socketRef.current.on('video_offer', async (data) => {
            console.log('📹 Received video offer from:', data.from_username);
            await handleVideoOffer(data);
        });

        socketRef.current.on('video_answer', async (data) => {
            console.log('📹 Received video answer from:', data.from_username);
            await handleVideoAnswer(data);
        });

        socketRef.current.on('ice_candidate', async (data) => {
            console.log('📹 Received ICE candidate from:', data.from_sid);
            await handleIceCandidate(data);
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
                socketRef.current.off('accent_status_changed');
                socketRef.current.off('gender_status_changed');
                socketRef.current.off('receive_audio');
                socketRef.current.off('streaming_started');
                socketRef.current.off('streaming_stopped');
                socketRef.current.off('video_status_changed');
                socketRef.current.off('video_request');
                socketRef.current.off('video_offer');
                socketRef.current.off('video_answer');
                socketRef.current.off('ice_candidate');

                socketRef.current.emit('leave_room', { room_code: roomCode });
                socketRef.current.disconnect();
            }

            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }

            // Cleanup video streams
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }

            // Close all peer connections
            Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
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
        const now = Date.now();

        // Clean up old entries from recently played (older than DUPLICATE_WINDOW_MS)
        recentlyPlayedRef.current = recentlyPlayedRef.current.filter(
            item => (now - item.playedAt) < DUPLICATE_WINDOW_MS
        );

        // Check if already in queue
        const inQueue = audioQueueRef.current.some(
            item => item.timestamp === audioData.timestamp &&
                item.username === audioData.username
        );

        if (inQueue) {
            console.log('⚠️ [DUPLICATE BLOCKED] Audio already in queue');
            return;
        }

        // Check if recently played (by timestamp OR by text content within time window)
        const recentlyPlayed = recentlyPlayedRef.current.some(
            item => (
                (item.timestamp === audioData.timestamp && item.username === audioData.username) ||
                (item.text === audioData.text && item.username === audioData.username)
            )
        );

        if (recentlyPlayed) {
            console.log('⚠️ [DUPLICATE BLOCKED] Audio was recently played');
            return;
        }

        const queueTime = now;
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

            // Track this audio as recently played to prevent duplicates
            recentlyPlayedRef.current.push({
                timestamp: audioData.timestamp,
                username: audioData.username,
                text: audioData.text,
                playedAt: Date.now()
            });

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

        if (socketRef.current && socketRef.current.connected && userData) {
            socketRef.current.emit('toggle_mute', {
                muted: newMutedState,
                user_id: userData.user_id
            });
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

            // ✅ FIXED: Get current user's ID from localStorage
            const currentUserId = localStorage.getItem('userId');

            // Find the current logged-in user in the members list
            const currentUser = response.payload.members.find(
                member => String(member.user_id) === String(currentUserId)
            );

            let newUserData;
            if (currentUser) {
                // User is a member of this room
                newUserData = {
                    username: currentUser.username,
                    user_id: currentUser.user_id
                };
                setUsername(currentUser.username);
                console.log('✅ Current user found after join:', currentUser.username, currentUser.user_id);
            } else {
                // Fallback: user might be the initiator
                newUserData = {
                    username: response.payload.initiator_name,
                    user_id: response.payload.initiator_id
                };
                setUsername(response.payload.initiator_name);
                console.log('⚠️ Using initiator as fallback after join');
            }

            setUserData(newUserData);

            // ✅ CRITICAL: Reset join flag and emit join_room with correct user data
            if (socketRef.current && socketRef.current.connected) {
                console.log('🔄 Resetting join flag and re-joining with correct user data...');
                hasJoinedRoomRef.current = false;

                socketRef.current.emit('join_room', {
                    room_code: roomCode,
                    username: newUserData.username,
                    user_id: newUserData.user_id
                });

                hasJoinedRoomRef.current = true;
                console.log('✅ Emitted join_room with correct user:', newUserData.username, newUserData.user_id);
            }

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

        if (socketRef.current && socketRef.current.connected && userData) {
            socketRef.current.emit('raise_hand', {
                raised: newHandState,
                user_id: userData.user_id
            });
        }
    };

    const handleAccentChange = (e) => {
        const newAccent = e.target.value;
        setCurrentAccent(newAccent);

        console.log(` [ACCENT CHANGED] ${newAccent}`);

        if (socketRef.current && socketRef.current.connected && userData) {
            socketRef.current.emit('change_accent', {
                accent: newAccent,
                user_id: userData.user_id
            });
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

        if (socketRef.current && socketRef.current.connected && userData) {
            socketRef.current.emit('change_gender', {
                gender: gender,
                user_id: userData.user_id
            });
        }
    };

    // Video Functions
    const handleVideoToggle = async () => {
        const newVideoState = !videoEnabled;
        setVideoEnabled(newVideoState);

        console.log(`📹 [VIDEO TOGGLE] ${newVideoState ? 'ENABLED' : 'DISABLED'}`);

        if (newVideoState) {
            // Enable video
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    },
                    audio: false
                });

                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Notify server
                if (socketRef.current && socketRef.current.connected && userData) {
                    socketRef.current.emit('toggle_video', {
                        video_enabled: true,
                        user_id: userData.user_id
                    });
                }

                console.log('✅ Local video stream started');
            } catch (error) {
                console.error('❌ Error accessing camera:', error);
                alert('Could not access camera. Please check permissions.');
                setVideoEnabled(false);
            }
        } else {
            // Disable video
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }

            // Close all peer connections
            Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
            peerConnectionsRef.current = {};

            // Clear remote streams
            setRemoteStreams({});

            // Notify server
            if (socketRef.current && socketRef.current.connected && userData) {
                socketRef.current.emit('toggle_video', {
                    video_enabled: false,
                    user_id: userData.user_id
                });
            }

            console.log('⏹️ Local video stream stopped');
        }

        setParticipants(prev =>
            prev.map(p =>
                p.username === username ? { ...p, video_enabled: newVideoState } : p
            )
        );
    };

    const createPeerConnection = async (targetSid, isOfferer) => {
        if (peerConnectionsRef.current[targetSid]) {
            console.log('📹 Peer connection already exists for:', targetSid);
            return peerConnectionsRef.current[targetSid];
        }

        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionsRef.current[targetSid] = peerConnection;

        // Add local stream tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('ice_candidate', {
                    target_sid: targetSid,
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                });
            }
        };

        // Handle incoming remote stream
        peerConnection.ontrack = (event) => {
            console.log('📹 Received remote track from:', targetSid);
            const [remoteStream] = event.streams;
            setRemoteStreams(prev => ({
                ...prev,
                [targetSid]: remoteStream
            }));
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            console.log(`📹 Connection state (${targetSid}):`, peerConnection.connectionState);
            if (peerConnection.connectionState === 'disconnected' ||
                peerConnection.connectionState === 'failed') {
                delete peerConnectionsRef.current[targetSid];
                setRemoteStreams(prev => {
                    const newStreams = { ...prev };
                    delete newStreams[targetSid];
                    return newStreams;
                });
            }
        };

        // If we're the offerer, create and send offer
        if (isOfferer) {
            try {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);

                socketRef.current.emit('video_offer', {
                    target_sid: targetSid,
                    sdp: offer.sdp,
                    type: offer.type
                });

                console.log('📹 Sent video offer to:', targetSid);
            } catch (error) {
                console.error('❌ Error creating offer:', error);
            }
        }

        return peerConnection;
    };

    const handleVideoOffer = async (data) => {
        try {
            const peerConnection = await createPeerConnection(data.from_sid, false);

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription({ type: data.type, sdp: data.sdp })
            );

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socketRef.current.emit('video_answer', {
                target_sid: data.from_sid,
                sdp: answer.sdp,
                type: answer.type
            });

            console.log('📹 Sent video answer to:', data.from_sid);
        } catch (error) {
            console.error('❌ Error handling video offer:', error);
        }
    };

    const handleVideoAnswer = async (data) => {
        try {
            const peerConnection = peerConnectionsRef.current[data.from_sid];
            if (peerConnection) {
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: data.type, sdp: data.sdp })
                );
                console.log('✅ Set remote description from answer');
            }
        } catch (error) {
            console.error('❌ Error handling video answer:', error);
        }
    };

    const handleIceCandidate = async (data) => {
        try {
            const peerConnection = peerConnectionsRef.current[data.from_sid];
            if (peerConnection && data.candidate) {
                await peerConnection.addIceCandidate(
                    new RTCIceCandidate({
                        candidate: data.candidate,
                        sdpMid: data.sdpMid,
                        sdpMLineIndex: data.sdpMLineIndex
                    })
                );
                console.log('✅ Added ICE candidate');
            }
        } catch (error) {
            console.error('❌ Error adding ICE candidate:', error);
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

                                    <span
                                        className={`px-3 py-1 rounded-full font-medium cursor-pointer ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        onClick={() => {
                                            console.log('🔍 Connection Status Debug:');
                                            console.log('  isConnected:', isConnected);
                                            console.log('  Socket exists:', !!socketRef.current);
                                            console.log('  Socket connected:', socketRef.current?.connected);
                                            console.log('  Socket ID:', socketRef.current?.id);
                                        }}
                                        title="Click to debug connection"
                                    >
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
                            {/* Video Grid Section */}
                            {(videoEnabled || Object.keys(remoteStreams).length > 0) && (
                                <div className="w-full max-w-4xl mb-6">
                                    <div className={`grid gap-4 ${Object.keys(remoteStreams).length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                        {/* Local Video */}
                                        {videoEnabled && (
                                            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg aspect-video">
                                                <video
                                                    ref={localVideoRef}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                    <p className="text-white text-sm font-medium flex items-center gap-2">
                                                        <Video className="w-4 h-4" />
                                                        {username} (You)
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Remote Videos */}
                                        {Object.entries(remoteStreams).map(([sid, stream]) => {
                                            const participant = participants.find(p => p.sid === sid);
                                            return (
                                                <div key={sid} className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg aspect-video">
                                                    <video
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-full object-cover"
                                                        ref={(videoElement) => {
                                                            if (videoElement && stream) {
                                                                videoElement.srcObject = stream;
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                        <p className="text-white text-sm font-medium flex items-center gap-2">
                                                            <Video className="w-4 h-4" />
                                                            {participant?.username || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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

                                <button
                                    onClick={() => {
                                        console.log('🎥 VIDEO BUTTON CLICKED!');
                                        handleVideoToggle();
                                    }}
                                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-lg ${videoEnabled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    title={videoEnabled ? "Turn Off Video" : "Turn On Video"}
                                    style={{ border: '2px solid red', display: "none" }}
                                >
                                    {videoEnabled ? (
                                        <Video className="w-5 h-5 lg:w-6 lg:h-6" />
                                    ) : (
                                        <VideoOff className="w-5 h-5 lg:w-6 lg:h-6" />
                                    )}
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

                                                                        {/* Video Status */}
                                                                        {participant.video_enabled && (
                                                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-100 text-purple-700 whitespace-nowrap">
                                                                                <Video className="w-2.5 h-2.5" />
                                                                                <span>Video</span>
                                                                            </div>
                                                                        )}
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

                                                                            {/* Video Status */}
                                                                            {participant.video_enabled && (
                                                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-100 text-green-700 whitespace-nowrap">
                                                                                    <Video className="w-2.5 h-2.5" />
                                                                                    <span>Video</span>
                                                                                </div>
                                                                            )}
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