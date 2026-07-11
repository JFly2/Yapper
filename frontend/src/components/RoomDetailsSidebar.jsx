import "../styles/RoomDetailsSidebar.css";

export default function RoomDetailsSidebar ({
    activeRoom,
    members,
    onKickMember,
    onLeaveRoom,
    onDeleteRoom,
    membersLoading,
    membersError,
    isOpen
}){
    return (
        <aside className={`room-details-sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="room-details-header">
                <h2 className="room-details-title">{activeRoom.name}</h2>
                <p className="room-details-meta">Role: {activeRoom.role}</p>
                <p className="room-details-meta">Join Code: {activeRoom.joinCode}</p>
            </div>

            <div className="room-details-section">
                <h3 className="room-details-section-title">Members</h3>

                {membersLoading && <p className="room-details-message">Loading members...</p>}
                {membersError && <p className="room-details-error">{membersError}</p>}

                <div className="room-members-list">
                    {members.map((member) => (
                        <div key={member.userId} className="room-member-row">
                            <div className="room-member-info">
                                <span className="room-member-name">{member.username}</span>
                                <span className="room-member-role">{member.role}</span>
                            </div>

                            {activeRoom.role === "OWNER" && member.role === "MEMBER" && (
                                <button
                                    type="button"
                                    className="kick-member-button"
                                    onClick={() => onKickMember(member.userId)}
                                >
                                    Kick
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="room-details-actions">
                {activeRoom.role === "OWNER" ? (
                    <button type="button" className="delete-room-button" onClick={onDeleteRoom}>
                        Delete Room
                    </button>
                ) : (
                    <button type="button" className="leave-room-button" onClick={onLeaveRoom}>
                        Leave Room
                    </button>
                )}
            </div>
        </aside>
    );
}
