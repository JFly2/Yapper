import "../styles/RoomSideBar.css";

export function RoomSidebar({

                                roomInput,

                                setRoomInput,

                                joinRoom

                            }) {

    function handleJoinRoom(
        event
    ) {

        event.preventDefault();

        if (
            roomInput.trim() !== ""
        ) {

            joinRoom(roomInput);
        }
    }

    return (

        <aside
            className="room-sidebar"
        >

            <h2
                className="sidebar-heading"
            >
                Rooms
            </h2>

            <input

                className="room-input"

                type="text"

                value={roomInput}

                onChange={(event) =>

                    setRoomInput(
                        event.target.value
                    )
                }
            />

            <button

                className="join-button"

                onClick={
                    handleJoinRoom
                }

                disabled={
                    !roomInput.trim()
                }
            >
                Join Room
            </button>

            <div>

                <p
                    className="joined-rooms"
                >
                    JOINED ROOMS
                </p>

            </div>

        </aside>
    );
}
