import React, { StrictMode, Suspense, lazy } from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { AppClient } from '../../client';
import { FillArea } from '../../shared';

const CardFormNewLazy = lazy(() => import(/* webpackChunkName: "new" */ '../CardForm/CardFormNew'));
const CardFormEditLazy = lazy(() => import(/* webpackChunkName: "edit" */ '../CardForm/CardFormEdit'));
const CardFormCopyLazy = lazy(() => import(/* webpackChunkName: "copy" */ '../CardForm/CardFormCopy'));
const CardListLazy = lazy(() => import(/* webpackChunkName: "list" */ '../CardList/CardList'));

export type Props = {
  client: AppClient;
};

const App: React.FunctionComponent<Props> = ({ client }) => {
  return (
    <StrictMode>
      <Suspense fallback={<FillArea>Loading...</FillArea>}>
        <Switch>
          <Route
            path="/new"
            exact={true}
            render={({ history }) => (
              <CardFormNewLazy
                client={client}
                onBack={() => history.goBack()}
                onAfterSave={() => history.push('/')}
              />
            )}
          />
          <Route
            path="/edit/:id"
            exact={true}
            render={({ history, match }: RouteComponentProps<{ id: string }>) => (
              <CardFormEditLazy
                client={client}
                onBack={() => history.goBack()}
                id={match.params.id}
                onAfterSave={() => history.push('/')}
              />
            )}
          />
          <Route
            path="/copy/:id"
            exact={true}
            render={({ history, match }: RouteComponentProps<{ id: string }>) => (
              <CardFormCopyLazy
                client={client}
                onBack={() => history.goBack()}
                id={match.params.id}
              />
            )}
          />
          <Route
            path="/"
            exact={true}
            render={({ history }) => (
              <CardListLazy
                client={client}
                onCardAdd={() => history.push('/new')}
                onCardCopy={(id) => history.push(`/copy/${id}`)}
                onCardEdit={(id) => history.push(`/edit/${id}`)}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </StrictMode>
  );
};

export default App;
