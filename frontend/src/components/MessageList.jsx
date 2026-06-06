
import {useEffect, useRef} from "react";
import {Message} from "./Message.jsx";
import "../styles/MessageList.css"
export function MessageList ({messageList}){

    const messageChatRef = useRef(null);

    useEffect(() => {
        const containerElem = messageChatRef.current;

        if (containerElem){
            containerElem.scrollTop = containerElem.scrollHeight;
        }

    }, [messageList])


    return (

        <div
            className={"messages-container"}
            ref={messageChatRef}
        >

            {messageList.map((message) => (
                <Message
                    key={message.id}
                    sender={message.sender}
                    content={message.content}
                />
            ))}

        </div>
    );
}
