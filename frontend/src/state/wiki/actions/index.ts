
import WikiAction from './WikiAction';
import WikisAction from './WikisAction';
import CreateWikiAction from './CreateWikiAction';
import UpdateWikiAction from './UpdateWikiAction';
import DeleteWikiAction from './DeleteWikiAction';

type Action = WikiAction
    | WikisAction
    | CreateWikiAction
    | UpdateWikiAction
    | DeleteWikiAction;
export default Action;