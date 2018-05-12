import FilmAction from './FilmAction';
import FilmsAction from './FilmsAction';
import CreateFilmAction from './CreateFilmAction';
import DeleteFilmAction from './DeleteFilmAction';

type Action = FilmAction | FilmsAction | CreateFilmAction | DeleteFilmAction;
export default Action;