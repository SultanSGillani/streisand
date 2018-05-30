
import IMessage from '../models/IMessage';
import MessageAction from '../actions/MessageAction';

type Action = MessageAction;

function messages(state: IMessage[] = [], action: Action): IMessage[] {
    switch (action.type) {
        case 'ADD_MESSAGE':
            const result = [action.message];
            for (const message of state) {
                if (message.content !== action.message.content) {
                    // We found a duplicate message. Replace the new one with the exisiting message.
                    result[0] = message;
                }
            }
            return result;
        case 'REMOVE_MESSAGE':
            return state.filter(message => message.id !== action.id);
        default:
            return state;
    }
}

export default messages;