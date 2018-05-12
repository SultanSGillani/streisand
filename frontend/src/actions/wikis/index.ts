import WikiAction from './WikiAction';
import WikisAction from './WikisAction';
import CreateWikiAction from './CreateWikiAction';
import UpdateWikiAction from './UpdateWikiAction';
import DeleteWikiAction from './DeleteWikiAction';

type Action = WikisAction | CreateWikiAction | WikiAction | UpdateWikiAction | DeleteWikiAction;
export default Action;