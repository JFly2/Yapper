import "../styles/RoomSideBar.css";
import { useNavigate } from "react-router-dom";

export function RoomSidebar({roomInput, setRoomInput, joinRoom, joinRoomByCode, joinedRooms, activeRoomId, isConnected, onOpenCreateRoom}) {

    const navigate = useNavigate();

    async function handleJoinRoom(event) {
        event.preventDefault();

        if (roomInput.trim()) {
            await joinRoomByCode(roomInput);
            setRoomInput("");
        }
    }

    function handleLogOut(){
        sessionStorage.removeItem("jwt_token");
        sessionStorage.removeItem("username");
        navigate("/login")
    }

    return (

        <aside
            className="room-sidebar"
        >

            <h2 className="sidebar-heading">
                Rooms
            </h2>

            <input
                className="room-input"
                type="text"
                value={roomInput}
                placeholder={"Enter join code"}
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
                {isConnected ? "Join Room": "Connecting..."}
            </button>

            <button
                type={"button"}
                className={"create-room-button"}
                onClick={onOpenCreateRoom}
                disabled={!isConnected}
            >
                Create Room
            </button>

            <div>
                <p
                    className="joined-rooms"
                >
                    JOINED ROOMS
                </p>

                {joinedRooms.map((room) => (
                    <button
                        key={room.id}
                        type={"button"}
                        className={
                            String(room.id) === activeRoomId
                                ? "room-item active-room"
                                : "room-item"
                        }
                    onClick={() => joinRoom(String(room.id))}
                >
                        {room.name}
                    </button>

                        ))}
            </div>

            <button className={"logout-button"} onClick={handleLogOut}>Log Out</button>
        </aside>
    );
}
