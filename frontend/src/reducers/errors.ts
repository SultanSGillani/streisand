import ErrorAction from '../actions/ErrorAction';

type Action = ErrorAction;

function errors(state: string[] = [], action: Action): string[] {
    switch (action.type) {
        case 'ADD_ERROR':
            return [action.message, ...state.slice(0, 2)];
        case 'REMOVE_ERROR':
            switch (action.index) {
                case 0: return state.slice(1, 3);
                case 1: return [...state.slice(0, 1), ...state.slice(2, 3)];
                case 2: return state.slice(0, 2);
                default: return state;
            }
        default:
            return state;
    }
}

export default errors;