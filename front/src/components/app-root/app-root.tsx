import { Component, h, State } from '@stencil/core';
import { ClientState } from '../../enums/client-state';
import { ActiveViewService } from '../../services/active-view-service';
import { ClientStateMediatorService } from '../../services/client-state-mediator-service';
import { InjectorFactory } from '../../services/Injector-factory';
import { Logger } from '../../services/logger/logger';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() clientState: ClientState;

  private clientStateProvider: ClientStateMediatorService

  constructor() {
    this.clientStateProvider = InjectorFactory.get().inject(ClientStateMediatorService);

    this.clientStateProvider.onStateChange(state => {
      this.clientState = state;
      this.onClientStateChange(state);
    });
  }

  @Logger()
  onClientStateChange(state: ClientState): void {
    if (state === ClientState.None) {
      this.clientStateProvider.switchState(ClientState.Signing);
    }
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
      case ClientState.None: return this.renderSuspendView();
      case ClientState.Switching: return this.renderSuspendView();
      case ClientState.Signing: return this.renderLoginView();
      default: return this.renderErrorView();
    }
  }

  @Logger()
  renderSuspendView(): string {
    return (
      <suspend-view id={ActiveViewService.getIdByClientState(this.clientState)}></suspend-view>
    );
  }

  @Logger()
  renderLoginView(): string {
    return (
      <login-view id={ActiveViewService.getIdByClientState(this.clientState)}></login-view>
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
