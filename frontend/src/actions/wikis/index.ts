import WikiAction from './WikiAction';
import WikisAction from './WikisAction';
import CreateWikiAction from './CreateWikiAction';
import UpdateWikiAction from './UpdateWikiAction';
import RemoveWikiAction from './RemoveWikiAction';

type Action = WikisAction | CreateWikiAction | WikiAction | UpdateWikiAction | RemoveWikiAction;
export default Action;