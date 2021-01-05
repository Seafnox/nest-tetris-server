import { Component, Host, h, Listen, Element } from '@stencil/core';
import { generateId } from '../+helpers/generate-id';

@Component({
  tag: 'login-view',
  styleUrl: 'login-view.css',
  shadow: true,
})
export class LoginView {
  @Element() host: HTMLElement;

  private inputId = generateId('input');

  private inputEl: HTMLInputElement;

  @Listen('keypress', {target: 'window'})
  public onWindowKeyPressed(event: KeyboardEvent): void {
    if (!this.inputEl) {
      this.setInputElement();
    }

    if (event.composedPath()[0] !== this.inputEl) {
      this.inputEl.focus();
    }
  }

  private setInputElement(): void {
    this.inputEl = this.host.shadowRoot.getElementById(this.inputId) as HTMLInputElement;

    if (!this.inputEl) {
      console.error('Cannot find input element in host', this.host);
    }
  }

  render(): string {
    return (
      <Host>
        <div class="form">
          <h3 class="title">What's your nickname?</h3>
          <input class="input" id={this.inputId} type="text" maxlength="14"  />
        </div>
      </Host>
    );
  }

}
