import * as React from 'react';
import { Store as ReduxStore } from 'redux';
import { Route, Redirect, RouterState, RedirectFunction } from 'react-router';

import Store from './store';

import App from './pages/App';
import Themes from './components/Themes';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import StaffTools from './components/StaffTools';

import InvitesPage from './pages/InvitesPage';
import InviteView from './components/invites/InviteView';

import WikiPage from './pages/wikis/WikiPage';
import WikisPage from './pages/wikis/WikisPage';

import FilmPage from './pages/films/FilmPage';
import FilmsPage from './pages/films/FilmsPage';
import CreateFilmView from './components/films/CreateFilmView';
import ReleasesPage from './pages/films/ReleasesPage';
import TorrentUploadPage from './pages/films/TorrentUploadPage';
import DetachedTorrentsPage from './pages/DetachedTorrentsPage';

import ForumPage from './pages/forums/ForumPage';
import ForumTopicPage from './pages/forums/ForumTopicPage';
import ForumThreadPage from './pages/forums/ForumThreadPage';
import CreateWikiView from './components/wikis/CreateWikiView';
import SearchFilmView from './components/films/SearchFilmView';

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
                <Route path="/register" component={RegistrationPage} onEnter={checkAuth} />
                <Route path="/register/:key" component={RegistrationPage} onEnter={checkAuth} />
                <Route path="/themes" component={Themes} />
                <Route onEnter={requireAuth}>
                    <Route path="/home" component={HomePage} />
                    <Route path="/tools" component={StaffTools} />
                    <Route path="/changepassword" component={ChangePasswordPage} />

                    <Route path="/user/:userId" component={UserPage} />
                    <Redirect from="/user" to="/home" />

                    <Route path="/invites/create" component={InviteView} />
                    <Route path="/invites/:page" component={InvitesPage} />
                    <Redirect from="/invites" to="/invites/1" />

                    <Route path="/films/create" component={CreateFilmView} />
                    <Route path="/films/search" component={SearchFilmView} />
                    <Route path="/films/:page" component={FilmsPage} />
                    <Redirect from="/films" to="/films/1" />
                    <Route path="/film/:filmId" component={FilmPage} />
                    <Route path="/film/:filmId/:torrentId" component={FilmPage} />
                    <Redirect from="/film" to="/films/1" />

                    <Route path="/releases/:page" component={ReleasesPage} />
                    <Redirect from="/releases" to="/releases/1" />

                    <Route path="/torrents/detached/:page" component={DetachedTorrentsPage} />
                    <Redirect from="/torrents/detached" to="/torrents/detached/1" />
                    <Route path="/torrents/upload/:filmId" component={TorrentUploadPage} />

                    <Route path="/wikis/create" component={CreateWikiView} />
                    <Route path="/wikis/:page" component={WikisPage} />
                    <Redirect from="/wikis" to="/wikis/1" />
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
