import "../styles/Message.css";

export function Message({
                            sender,
                            content,
                            timestamp,
                            isOwnMessage
                        }) {
    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
        : "";

    return (
        <div
            className={`message-row ${
                isOwnMessage ? "own-message" : "other-message"
            }`}
        >
            <div className="message-bubble">
                <div className="message-header">
                    <span className="message-sender">
                        {sender || "Unknown User"}
                    </span>

                    <span className="message-time">
                        {formattedTime}
                    </span>
                </div>

                <p className="message-content">
                    {content}
                </p>
            </div>
        </div>
    );
}
