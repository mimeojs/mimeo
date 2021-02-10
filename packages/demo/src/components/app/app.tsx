import { Build, Component, ComponentInterface, h, Host } from '@stencil/core';
import { createRouter, href, match, Route } from 'stencil-router-v2';
import { client } from '../../api/apollo';
import { Header } from '../header';

const Router = createRouter();
const APOLLO_CACHE = 'apollo-cache';

@Component({
  tag: 'mimeo-app',
})
export class MimeoApp implements ComponentInterface {
  componentWillLoad() {
    // restore cache from script tag if we're running in the browser
    if (Build.isBrowser) {
      const element = document.head.querySelector(`script[name="${APOLLO_CACHE}"][type='application/json']`);
      if (element) {
        client.restore(JSON.parse(element.textContent));
      }
    }
  }

  componentDidLoad() {
    // extract cache to script tag if we're running on the server
    if (Build.isServer) {
      const meta = document.createElement('script');
      meta.setAttribute('name', APOLLO_CACHE);
      meta.setAttribute('type', 'application/json');
      meta.innerText = JSON.stringify(client.extract());
      document.head.appendChild(meta);
    }
  }

  render() {
    return (
      <Host>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <Router.Switch>
            <Route path="/">
              <Header title="The root" />
              ROOT
            </Route>
            <Route path={match('/articles/:slug')} render={({ slug }) => <mimeo-article slug={slug} />} />
          </Router.Switch>
          <a {...href('/')}>root</a>
          <a {...href('/articles/1/')}>article 1</a>
          <a {...href('/articles/2/')}>article 2</a>
        </main>
      </Host>
    );
  }
}
