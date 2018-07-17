
import FilmAction from './FilmAction';
import FilmsAction from './FilmsAction';
import CreateFilmAction from './CreateFilmAction';
import DeleteFilmAction from './DeleteFilmAction';
import UpdateFilmAction from './UpdateFilmAction';
import FilmSearchAction from './FilmsSearchAction';

type Action = FilmAction | FilmsAction | CreateFilmAction | DeleteFilmAction | FilmSearchAction | UpdateFilmAction;
export default Action;