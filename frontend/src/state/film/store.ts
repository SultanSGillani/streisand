
import IFilm from '../../models/IFilm';
import { IItemList, IItemPages } from '../../models/base/IPagedItemSet';

export interface IFilmStore extends IItemList<IFilm> {
    search: IItemPages;
}