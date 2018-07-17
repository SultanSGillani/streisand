
import CollectionAction from './CollectionAction';
import CollectionsAction from './CollectionsAction';
import CreateCollectionAction from './CreateCollectionAction';
import UpdateCollectionAction from './UpdateCollectionAction';
import DeleteCollectionAction from './DeleteCollectionAction';

type Action = CollectionAction
    | CollectionsAction
    | CreateCollectionAction
    | UpdateCollectionAction
    | DeleteCollectionAction;
export default Action;
