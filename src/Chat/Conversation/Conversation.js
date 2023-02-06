import Message from '../Message/Message';
import './Conversation.scss';

export default function Conversation() {
    return (
        <div className="conversation">
            <Message />
            <Message isOwn={true}/>
            <Message isOwn={true}/>
            <Message />
            <Message />
            <Message isOwn={true}/>
        </div>
    )
}