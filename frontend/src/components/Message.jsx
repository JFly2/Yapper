
export function Message ({sender,content}){

    return (
        <div>

            <strong>
                {sender}
            </strong>

            <p>
                {content}
            </p>
        </div>
    );
}
