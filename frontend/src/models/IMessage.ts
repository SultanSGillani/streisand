
interface IMessage {
    id: string;
    content: string;
    level: 'danger' | 'warning' | 'info';
}

export default IMessage;