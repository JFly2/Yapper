import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import "../styles/ChatBox.css";

import { MessageInput } from "./MessageInput.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";
import { MessageList } from "./MessageList.jsx";

export function ChatBox() {

    const [stompClient, setStompClient] = useState(null);

    // text currently being typed
    const [roomInput, setRoomInput] = useState("");

    // room actually joined
    const [roomId, setRoomId] = useState("");

    const [messages, setMessages] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);

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
                setStompClient(
                    stompClient
                );
            },

            (error) => {
                console.error(
                    "Connection error:",
                    error
                );
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

    function joinRoom(newRoomId) {

        if (
            !stompClient ||
            !stompClient.connected
        ) {
            return;
        }

        if (!newRoomId.trim()) {
            return;
        }

        if (currentSubscription) {
            currentSubscription.unsubscribe();
        }

        setMessages([]);

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

        console.log(
            `Joined room ${newRoomId}`
        );
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

            roomId,

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

            <RoomSidebar

                roomInput={roomInput}

                setRoomInput={
                    setRoomInput
                }

                joinRoom={joinRoom}
            />

            <div className="chat-main">

                <div className="chat-header">

                    Room:
                    {" "}
                    {roomId ||
                        "No Room Selected"}

                </div>

                <MessageList
                    messageList={messages}
                />

                <MessageInput
                    sendMessage={
                        sendMessage
                    }
                />

            </div>

        </div>
    );
}
