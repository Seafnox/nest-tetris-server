import { Component, h, State } from '@stencil/core';
import { ClientState } from '../../enums/client-state';
import { getViewIdByClientState } from '../../helpers/get-view-id-by-client-state';
import { ClientStateMediatorService } from '../../services/client-state-mediator-service';
import { ClientStateStore } from '../../services/client-state-store';
import { InjectorFactory } from '../../services/Injector-factory';
import { Logger } from '../../services/logger/logger';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() clientState: ClientState;

  private readonly clientStateStore: ClientStateStore

  constructor() {
    this.clientStateStore = InjectorFactory.get().inject(ClientStateStore);
    const controllerMediator = InjectorFactory.get().inject(ClientStateMediatorService);

    controllerMediator.init();
    this.clientStateStore.addClientStateListener(state => {
      this.clientState = state;
    });
  }

  @Logger()
  render(): string {
    return (
      <div class="app-wrapper">
        <header>
          Stencil App Starter ({this.clientState})
        </header>

        <main class="page-wrapper">
          { this.renderClientView() }
        </main>
      </div>
    );
  }

  @Logger()
  renderClientView(): string {
    switch (this.clientState) {
      case ClientState.Init: return this.renderSuspendView();
      case ClientState.Switching: return this.renderSuspendView();
      case ClientState.Signing: return this.renderLoginView();
      default: return this.renderErrorView();
    }
  }

  @Logger()
  renderSuspendView(): string {
    return (
      <suspend-view id={getViewIdByClientState(this.clientState)}></suspend-view>
    );
  }

  @Logger()
  renderLoginView(): string {
    return (
      <login-view id={getViewIdByClientState(this.clientState)}/>
    );
  }

  @Logger()
  renderErrorView(): string {
    return (
      <div>
        <h2 style={ {color: '#884444', fontWeight: 'bolded'} }>
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
