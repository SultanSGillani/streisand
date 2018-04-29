
// editable fields
export interface IWikiUpdate {
    title: string;
    body: string;
}

interface IWiki extends IWikiUpdate {
    id: number;
    createdAt: string; // Date
    createdBy: number; // user id
    modifiedAt: string; // Date
    modifiedBy: number; // user id
    readAccessMinimumUserClass: number;
    writeAccessMinimumUserClass: number;
}

export default IWiki;