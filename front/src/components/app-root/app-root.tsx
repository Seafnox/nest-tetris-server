import { Component, h, State } from '@stencil/core';
import { ClientState } from '../../enums/client-state';
import { ClientStateMediatorService } from '../../services/client-state-mediator-service';
import { InjectorFactory } from '../../services/Injector-factory';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() clientState: ClientState;

  constructor() {
    const clientStateProvider = InjectorFactory.get().inject(ClientStateMediatorService);

    clientStateProvider.onStateChange(state => this.clientState = state);
  }

  render(): string {
    return (
      <div>
        <header>
          <h1>Stencil App Starter ({this.clientState})</h1>
        </header>

        <main>
          { this.renderClientView() }
        </main>
      </div>
    );
  }

  renderClientView(): string {
    switch (this.clientState) {
      case ClientState.None: return this.renderSuspendView();
      case ClientState.Switching: return this.renderSuspendView();
      case ClientState.Signing: return this.renderLoginView();
      default: return this.renderErrorView();
    }
  }

  renderSuspendView(): string {
    return (
      <suspend-view></suspend-view>
    );
  }

  renderLoginView(): string {
    return (
      <login-view></login-view>
    );
  }

  renderErrorView(): string {
    return (
      <div>
        <h2 style={ {background: '#884444'} }>
          ERROR
        </h2>
        <p>
          Welcome to the Stencil App Starter. You can use this starter to build entire apps all with web components using Stencil! Check out our docs on{' '}
          <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>
      </div>
    )
  }
}
