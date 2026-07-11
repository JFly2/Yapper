import {useState, useEffect, useCallback} from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../styles/ChatBox.css";
import api from "../services/api.js";
import { MessageInput } from "./MessageInput.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";
import { MessageList } from "./MessageList.jsx";
import { CreateRoomForm } from "./CreateRoomForm.jsx";
import RoomDetailsSidebar  from "./RoomDetailsSidebar.jsx";

function ChatBox() {
    const [stompClient, setStompClient] = useState(null);
    const [roomInput, setRoomInput] = useState("");
    const [roomId, setRoomId] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);

    const [detailsSidebarOpen, setDetailsSidebarOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState("");

    const currentUsername = sessionStorage.getItem("username");

    const activeRoom = joinedRooms.find(
        (room) => String(room.id) === roomId
    );

    useEffect(() => {
        const token = sessionStorage.getItem("jwt_token");
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {};

        stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                setStompClient(stompClient);
                setIsConnected(true);
            },
            (error) => {
                console.error("Connection error:", error);
                setIsConnected(false);
            }
        );

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    async function joinRoom(newRoomId) {
        if (!stompClient) {
            return;
        }
        if (!stompClient.connected) {
            return;
        }
        if (!newRoomId || !newRoomId.trim()) {
            return;
        }

        newRoomId = newRoomId.trim();

        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        try {
            const response = await api.get(`/messages/${newRoomId.trim()}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to load room history", error);
            setMessages([]);
        }

        const subscription = stompClient.subscribe(
            `/topic/room/${newRoomId}`,
            (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
        );

        setCurrentSubscription(subscription);
        setRoomId(newRoomId);
    }

    function sendMessage(content) {
        if (!stompClient || !stompClient.connected) return;
        if (!roomId) return;

        const message = {
            roomId: Number(roomId),
            content
        };

        stompClient.send("/app/yapper.send", {}, JSON.stringify(message));
    }

    async function joinRoomByCode(code) {
        const joinCode = code.trim().toUpperCase();
        if (!joinCode) return;

        try {
            const response = await api.post(`/rooms/code/${joinCode}`);
            await activateRoom(response.data);
        } catch (error) {
            console.error("Room not found", error);
        }
    }

    async function createRoom(roomData) {
        try {
            const response = await api.post("/rooms", roomData);
            const createdRoom = response.data;
            await activateRoom(createdRoom);
            return createdRoom;
        } catch (error) {
            console.error("Unable to create room", error);
            throw error;
        }
    }

    async function activateRoom(room) {
        setJoinedRooms((previousRooms) => {
            const prevJoined = previousRooms.some(
                (joinedRooms) => joinedRooms.id === room.id
            );
            return prevJoined ? previousRooms : [...previousRooms, room];
        });
        await joinRoom(String(room.id));
    }

    async function loadJoinedRooms() {
        try {
            const response = await api.get("/rooms/joined");
            setJoinedRooms(response.data);
        } catch (error) {
            console.error("Unable to load joined rooms:", error);
        }
    }

    useEffect(() => {
        void loadJoinedRooms();
    }, []);

    async function leaveRoom(roomToLeave) {
        try {
            await api.delete(`/rooms/${roomToLeave.id}/leave`);
            setJoinedRooms((currentRooms) => currentRooms.filter((room) => room.id !== roomToLeave.id));

            const leavingActiveRoom = String(roomToLeave.id) === roomId;
            if (leavingActiveRoom) {
                if (currentSubscription) {
                    currentSubscription.unsubscribe();
                    setCurrentSubscription(null);
                }
                setRoomId("");
                setMessages([]);
                setDetailsSidebarOpen(false);
                setMembers([]);
                setMembersError("");
            }
        } catch (error) {
            console.error("Unable to leave room:", error);
        }
    }

    async function deleteRoom(roomToDelete) {
        try {
            await api.delete(`/rooms/${roomToDelete.id}`);
            setJoinedRooms((currentRooms) => currentRooms.filter((room) => room.id !== roomToDelete.id));

            const deletingActiveRoom = String(roomToDelete.id) === roomId;
            if (deletingActiveRoom) {
                if (currentSubscription) {
                    currentSubscription.unsubscribe();
                    setCurrentSubscription(null);
                }
                setRoomId("");
                setMessages([]);
                setDetailsSidebarOpen(false);
                setMembers([]);
                setMembersError("");
            }
        } catch (error) {
            console.error("Unable to delete room: ", error);
        }
    }

    async function handleLeaveActiveRoom() {
        if (!activeRoom) return;
        const confirmed = window.confirm(`Leave ${activeRoom.name}?`);
        if (!confirmed) return;
        await leaveRoom(activeRoom);
    }

    async function handleDeleteActiveRoom() {
        if (!activeRoom) return;
        const confirmed = window.confirm(`Delete ${activeRoom.name}? This will delete it for everyone!`);
        if (!confirmed) return;

        if (activeRoom.role === "OWNER") {
            await deleteRoom(activeRoom);
        }
    }

    const loadRoomMembers = useCallback(async function loadRoomMembers(roomIdToLoad) {
        if (!roomIdToLoad) return;
        setMembersLoading(true);
        setMembersError("");

        try {
            const response = await api.get(`/rooms/${roomIdToLoad}/members`);
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to load room members", error);
            setMembersError("Unable to load room members.");
        } finally {
            setMembersLoading(false);
        }
    }, []);

    useEffect(() => {
        if (detailsSidebarOpen && roomId) {
            void loadRoomMembers(roomId);
        }
    }, [detailsSidebarOpen, roomId, loadRoomMembers]);

     function openDetailsSidebar() {
        if (!activeRoom) return;
        setDetailsSidebarOpen(true);
    }

    async function kickMember(userId) {
        if (!activeRoom || activeRoom.role !== "OWNER") return;

        try {
            await api.delete(`/rooms/${activeRoom.id}/members/${userId}`);
            setMembers((currentMembers) => currentMembers.filter((member) => member.userId !== userId));
        } catch (error) {
            console.error("Unable to kick member", error);
            setMembersError("Unable to kick member.");
        }
    }

    return (
        <div className="chat-container">
            <div className={`sidebar-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                {sidebarOpen && (
                    <RoomSidebar
                        roomInput={roomInput}
                        setRoomInput={setRoomInput}
                        joinRoom={joinRoom}
                        joinRoomByCode={joinRoomByCode}
                        joinedRooms={joinedRooms}
                        activeRoomId={roomId}
                        isConnected={isConnected}
                        onOpenCreateRoom={() => setCreateRoomOpen(true)}
                    />
                )}
            </div>


            <div className="chat-main">
                <div className="chat-header">
                    <button
                        className="sidebar-toggle"
                        type="button"
                        onClick={() => setSidebarOpen((open) => !open)}
                        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                        ☰
                    </button>

                    {roomId && activeRoom && (
                        <>
                            <span className="room-name">{activeRoom.name}</span>
                            <button
                                type="button"
                                className="room-details-button"
                                onClick={() => {
                                    if (detailsSidebarOpen) {
                                        setDetailsSidebarOpen(false);
                                    } else {
                                         openDetailsSidebar();
                                    }
                                }}
                            >
                                {detailsSidebarOpen ? "Close Details" : "Room Details"}
                            </button>

                        </>
                    )}

                </div>

                {!roomId ? (
                    <div className="chat-landing">
                        <h1>Find or join a room</h1>
                        <p>Join a room from the sidebar to start yapping!</p>
                        <div className="landing-actions">
                            <p>Use a room ID to join a group yap.</p>
                            <p>Your joined rooms will appear in the sidebar.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <MessageList messageList={messages} currentUsername={currentUsername} />
                        <MessageInput sendMessage={sendMessage} />
                    </>
                )}
            </div>

            {activeRoom && (
                <RoomDetailsSidebar
                    activeRoom={activeRoom}
                    members={members}
                    membersLoading={membersLoading}
                    membersError={membersError}
                    onKickMember={kickMember}
                    onLeaveRoom={handleLeaveActiveRoom}
                    onDeleteRoom={handleDeleteActiveRoom}
                    isOpen={detailsSidebarOpen}
                />
            )}

            {createRoomOpen && (
                <div className="modal-backdrop" onMouseDown={() => setCreateRoomOpen(false)}>
                    <div
                        className="create-room-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-room-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close-button"
                            aria-label="Close create room"
                            onClick={() => setCreateRoomOpen(false)}
                        >
                            ×
                        </button>
                        <CreateRoomForm createRoom={createRoom} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBox;
