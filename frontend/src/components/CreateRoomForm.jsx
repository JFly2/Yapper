import {useState} from "react";
import "../styles/CreateRoomForm.css"

export function CreateRoomForm({ createRoom }){
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [publicRoom, setPublicRoom] = useState(false);

    const [createdRoom, setCreatedRoom] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const[isCopied, setIsCopied] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
           setErrorMessage("Room name is required");
           return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setIsCopied(false);

            try {
                const room = await createRoom ({
                    name: trimmedName,
                    category: category.trim(),
                    publicRoom
                });

                setCreatedRoom(room);
                setName("");
                setCategory("");
                setPublicRoom(false);
            } catch (error) {
                console.error("Unable to create room", error);
                setErrorMessage("Unable to create room");
            } finally {
                setIsSubmitting(false);
            }
    }


    async function copyJoinCode() {

        if (!createdRoom || !createdRoom.joinCode){
            return;
        }

        try {
            await navigator.clipboard.writeText(createdRoom.joinCode);
            setIsCopied(true);
            setErrorMessage("");

            setTimeout(() => {
                setIsCopied(false);
                }, 2000);
        } catch (error){
            console.error("Unable to copy join code", error);
            setErrorMessage("Unable to copy join code");
            setIsCopied(false);
        }

    }

    return (
        <section className="create-room-section">
            {!createdRoom ? (
                <>
                    <h3>Create Room</h3>

                    <form onSubmit={handleSubmit}>
                        <input
                            className="room-name-input"
                            id="room-name"
                            type="text"
                            placeholder="Room name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            disabled={isSubmitting}
                        />

                        <input
                            className="room-category-input"
                            id="room-category"
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            disabled={isSubmitting}
                        />

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={publicRoom}
                                onChange={(event) =>
                                    setPublicRoom(event.target.checked)
                                }
                                disabled={isSubmitting}
                            />

                            Public Room
                        </label>

                        <button
                            className="create-room"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create Room"}
                        </button>
                    </form>
                </>
            ) : (
                <div className="created-room-result">
                    <h3>Room Created</h3>

                    <p>
                        Room created:{" "}
                        <strong>{createdRoom.name}</strong>
                    </p>

                    <p>
                        Join code:{" "}
                        <strong>{createdRoom.joinCode}</strong>
                    </p>

                    <button className={"copy-button"}
                        type="button"
                        onClick={copyJoinCode}
                    >
                        {isCopied ? "Copied" : "Copy Code"}
                    </button>

                    {/*
                    <button
                        type="button"
                        onClick={() => {
                            setCreatedRoom(null);
                            setIsCopied(false);
                            setErrorMessage("");
                        }}
                    >
                        Create Another Room
                    </button>

                    */}
                </div>
            )}

            {errorMessage && (
                <p className="create-room-error">
                    {errorMessage}
                </p>
            )}
        </section>
    );
}
