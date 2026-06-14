import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../styles/ChatBox.css";
import api from "../services/api.js";
import { MessageInput } from "./MessageInput.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";
import { MessageList } from "./MessageList.jsx";

function ChatBox() {

    const [stompClient, setStompClient] = useState(null);

    // text currently being typed
    const [roomInput, setRoomInput] = useState("");

    // room actually joined
    const [roomId, setRoomId] = useState("");

    const [messages, setMessages] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const currentUsername = localStorage.getItem("username");


    useEffect(() => {

        const token = localStorage.getItem("jwt_token");

        const socket = new SockJS(
            "http://localhost:8080/ws"
        );

        const stompClient =
            Stomp.over(socket);

        stompClient.connect(

            {
                Authorization:
                    `Bearer ${token}`
            },

            () => {
                console.log("Connected");
                setStompClient(stompClient);
                setIsConnected(true);
            },

            (error) => {
                console.error("Connection error:", error);
                setIsConnected(false);
            }
        );

        return () => {

            if (
                stompClient &&
                stompClient.connected
            ) {

                stompClient.disconnect(
                    () => {
                        console.log(
                            "Disconnected"
                        );
                    }
                );
            }
        };

    }, []);


    async function joinRoom(newRoomId) {

        if (!stompClient) {
            console.log("No stompClient yet");
            return;
        }

        if (!stompClient.connected) {
            console.log("stompClient exists but is not connected");
            return;
        }

        if (!newRoomId || !newRoomId.trim()) {
            console.log("Invalid room id");
            return;
        }

        newRoomId = newRoomId.trim();

        if (currentSubscription) {
            console.log("Unsubscribing from previous room");
            currentSubscription.unsubscribe();
        }


        try {
            const response = await api.get(`/messages/${newRoomId.trim()}`);

            console.log("Loaded room history for room: ", newRoomId);
            console.log(response.data);

            setMessages(response.data);

        } catch(error){
            console.log("Failed to load room history", error);
            setMessages([]);
        }


        const subscription =
            stompClient.subscribe(

                `/topic/room/${newRoomId}`,

                (message) => {

                    const receivedMessage =
                        JSON.parse(
                            message.body
                        );

                    setMessages(
                        (prevMessages) => [

                            ...prevMessages,

                            receivedMessage
                        ]
                    );
                }
            );

        setCurrentSubscription(
            subscription
        );

        setRoomId(newRoomId);

        setJoinedRooms((prevRooms) => {
            if (prevRooms.includes(newRoomId)) {
                return prevRooms;
            }
           return [...prevRooms, newRoomId];
        });
    }

    function sendMessage(content) {

        if (
            !stompClient ||
            !stompClient.connected
        ) {
            return;
        }

        if (!roomId) {
            return;
        }

        const message = {

            roomId: Number(roomId),

            content
        };

        stompClient.send(

            "/app/yapper.send",

            {},

            JSON.stringify(message)
        );
    }

    return (
        <div className="chat-container">

            <div className={`sidebar-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                {sidebarOpen && (
                    <RoomSidebar
                        roomInput={roomInput}
                        setRoomInput={setRoomInput}
                        joinRoom={joinRoom}
                        joinedRooms={joinedRooms}
                        activeRoomId={roomId}
                        isConnected={isConnected}
                    />
                )}
            </div>

            <div className="chat-main">
                <div className="chat-header">

                    <button
                        className={"sidebar-toggle"}
                        type={"button"}
                        onClick={() => setSidebarOpen((open) => (!open))}
                        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                        ☰
                    </button>

                    {roomId && (
                        <span className={"room-id"}>
                            Room: {roomId}
                        </span>
                    )}

                </div>

                {!roomId ? (
                    <div className="chat-landing">
                        <h1>Find or join a room</h1>

                        <p>
                            Join a room from the sidebar to start yapping!
                        </p>

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
        </div>
    );
}

export default ChatBox
