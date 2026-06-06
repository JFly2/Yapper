import {useState} from "react";
import "../styles/MessageInput.css";

export function MessageInput({sendMessage}){
    const [inputText, setInputText] = useState("");


    function handleSendMessage(){
        if (!inputText.trim()){
            return;
        }

        sendMessage(inputText);
        setInputText("");
    }

    return (
        <>

        <div className={"message-input-container"}>
            <input
                className={"message-input"}
                type={"text"}
                placeholder={"Send message"}
                size="30"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
            />
            <button className={"send-button"} onClick={handleSendMessage}>send</button>


            </div>
        </>
    );
}
