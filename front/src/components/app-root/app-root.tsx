import { Component, h, State, ComponentInterface } from '@stencil/core';
import { throttleTime } from 'rxjs/operators';
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

  private readonly clientStore = InjectorFactory.get().inject(UserStore);
  private readonly clientStatusMediator = InjectorFactory.get().inject(ClientStatusMediatorService);

  constructor() {
    this.clientStatusMediator.init();

    this.clientStore.status$()
      .pipe(throttleTime(1))
      .subscribe(state => {
        console.log('AppRoot', state);
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
          <mode-switcher></mode-switcher>
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
      case ClientStatus.Watching: return this.renderWatchingView();
      case ClientStatus.Playing: return this.renderPlayingView();
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

  @Logger()
  private renderWatchingView(): string {
    return (
      <watching-view id={getViewIdByClientState(this.clientState)}></watching-view>
    );
  }

  private renderPlayingView(): string {
    return (
      <playing-view id={getViewIdByClientState(this.clientState)}></playing-view>
    );
  }
}
