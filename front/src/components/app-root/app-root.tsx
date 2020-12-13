import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <header>
          <h1>Stencil App Starter</h1>
        </header>

        <main>
          <div class="app-home">
            <p>
              Welcome to the Stencil App Starter. You can use this starter to build entire apps all with web components using Stencil! Check out our docs on{' '}
              <a href="https://stenciljs.com">stenciljs.com</a> to get started.
            </p>

            <stencil-route-link url="/profile/stencil">
              <button>Profile page</button>
            </stencil-route-link>
          </div>
        </main>
      </div>
    );
  }
}
