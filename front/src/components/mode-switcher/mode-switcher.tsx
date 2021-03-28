import { Component, Host, h, State } from '@stencil/core';
import { throttleTime } from 'rxjs/operators';
import { ClientMode } from '../../enums/client-mode';
import { ClientStatus } from '../../enums/client-status';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserStore } from '../../services/user-store';

@Component({
  tag: 'mode-switcher',
  styleUrl: 'mode-switcher.css',
  shadow: true,
})
export class ModeSwitcher {
  @State() mode: ClientMode;

  private readonly clientStore = InjectorFactory.get().inject(UserStore);

  constructor() {
    this.clientStore.mode$()
      .pipe(throttleTime(1))
      .subscribe(mode => this.mode = mode);
  }

  render(): string {
    return (
      <Host>
        { this.mode === ClientMode.PlayingMode ? this.renderWatchSwitcher() : this.renderPlaySwitcher() }
      </Host>
    );
  }

  private renderWatchSwitcher(): string {
    return (
      <button onClick={this.switchToWatchMode.bind(this)}>Watch</button>
    )
  }

  private renderPlaySwitcher(): string {
    return (
      <button onClick={this.switchToPlayMode.bind(this)}>Play</button>
    );
  }

  private switchToWatchMode() {
    this.clientStore.setClientMode(ClientMode.WatchingMode);
    this.clientStore.switchStatus(ClientStatus.Switching);
  }

  private switchToPlayMode() {
    this.clientStore.setClientMode(ClientMode.PlayingMode);
    this.clientStore.switchStatus(ClientStatus.Switching);
  }
}
