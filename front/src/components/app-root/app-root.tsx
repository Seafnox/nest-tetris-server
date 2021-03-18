import { Component, h, State, ComponentInterface } from '@stencil/core';
import { ClientStatus } from '../../enums/client-status';
import { getViewIdByClientState } from '../../helpers/get-view-id-by-client-state';
import { ClientStatusMediatorService } from '../../services/client-status-mediator-service';
import { UserStore } from '../../services/user-store';
import { InjectorFactory } from '../../services/Injector-factory';
import { Logger } from '../../services/logger/logger';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot implements ComponentInterface {
  @State() clientState: ClientStatus;

  private readonly clientStateStore = InjectorFactory.get().inject(UserStore);
  private readonly controllerMediator = InjectorFactory.get().inject(ClientStatusMediatorService);

  constructor() {
    this.controllerMediator.init();

    this.clientStateStore.status$().subscribe(state => {
      this.clientState = state;
    });
  }

  @Logger()
  public connectedCallback() {}

  @Logger()
  public disconnectedCallback() {}

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
      case ClientStatus.Init: return this.renderSuspendView();
      case ClientStatus.Switching: return this.renderSuspendView();
      case ClientStatus.Signing: return this.renderLoginView();
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
