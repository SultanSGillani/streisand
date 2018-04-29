import * as React from 'react';
import { Store as ReduxStore } from 'redux';
import { Route, Redirect, RouterState, RedirectFunction } from 'react-router';

import Store from './store';

import App from './pages/App';
import Themes from './components/Themes';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';

import WikiPage from './pages/wikis/WikiPage';
import WikisPage from './pages/wikis/WikisPage';

import FilmPage from './pages/films/FilmPage';
import FilmsPage from './pages/films/FilmsPage';
import TorrentsPage from './pages/TorrentsPage';

import ForumPage from './pages/forums/ForumPage';
import ForumTopicPage from './pages/forums/ForumTopicPage';
import ForumThreadPage from './pages/forums/ForumThreadPage';
import CreateWikiView from './components/wikis/CreateWikiView';

export function createRoutes(store: ReduxStore<Store.All>) {
    function requireAuth(nextState: RouterState, replace: RedirectFunction) {
        if (!store.getState().sealed.auth.isAuthenticated) {
            replace('/login');
        }
    }

    function checkAuth(nextState: RouterState, replace: RedirectFunction) {
        if (store.getState().sealed.auth.isAuthenticated) {
            replace('/');
        }
    }

    return (
        <div>
            <Redirect from="/" to="/home" />
            <Route path="/" component={App}>
                <Route path="/login" component={LoginPage} onEnter={checkAuth} />
                <Route path="/themes" component={Themes} />
                <Route onEnter={requireAuth}>
                    <Route path="/home" component={HomePage} />
                    <Route path="/changepassword" component={ChangePasswordPage} />

                    <Route path="/user/:userId" component={UserPage} />
                    <Redirect from="/user" to="/home" />

                    <Route path="/films/:page" component={FilmsPage} />
                    <Redirect from="/films" to="/films/1" />
                    <Route path="/film/:filmId" component={FilmPage} />
                    <Route path="/film/:filmId/:torrentId" component={FilmPage} />
                    <Redirect from="/film" to="/films/1" />

                    <Route path="/torrents/:page" component={TorrentsPage} />
                    <Redirect from="/torrents" to="/torrents/1" />

                    <Route path="/wikis/:page" component={WikisPage} />
                    <Redirect from="/wikis" to="/wikis/1" />
                    <Route path="/wiki/create" component={CreateWikiView} />
                    <Route path="/wiki/:wikiId" component={WikiPage} />
                    <Redirect from="/wiki" to="/wikis/1" />

                    <Route path="/forum" component={ForumPage} />
                    <Route path="/forum/topic/:topicId/:page" component={ForumTopicPage} />
                    <Redirect from="/forum/topic" to="/forum" />
                    <Redirect from="/forum/topic/*" to="/forum/topic/*/1" />
                    <Route path="/forum/thread/:threadId/:page" component={ForumThreadPage} />
                    <Redirect from="/forum/thread" to="/forum" />
                    <Redirect from="/forum/thread/*" to="/forum/thread/*/1" />
                </Route>
                <Redirect from="*" to="/home" />
            </Route>
        </div>
    );
}
