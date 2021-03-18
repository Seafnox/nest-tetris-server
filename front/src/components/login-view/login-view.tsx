import { Component, Host, h, Listen, Element, ComponentInterface } from '@stencil/core';
import { generateId } from '../+helpers/generate-id';
import { UserStore } from '../../services/user-store';
import { InjectorFactory } from '../../services/Injector-factory';

@Component({
  tag: 'login-view',
  styleUrl: 'login-view.css',
  shadow: true,
})
export class LoginView implements ComponentInterface {
  @Element() host: HTMLElement;

  private inputId = generateId('input');

  private inputEl: HTMLInputElement;
  private readonly userStore = InjectorFactory.get().inject(UserStore);

  componentDidRender(): void {
    this.checkInputValue();
  }

  @Listen('keypress', {target: 'window'})
  public onWindowKeyPressed(event: KeyboardEvent): void {
    if (event.composedPath()[0] !== this.inputEl) {
      this.inputEl.focus();
    }

    console.log(event.code, event.key);

    if (event.code === 'Enter') {
      this.updateUserName();
    }
  }

  private updateUserName() {
    this.userStore.setUserName(this.inputEl.value);
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
          <input class="input" id={this.inputId} type="text" maxlength="14" />
        </div>
      </Host>
    );
  }

  private checkInputValue() {
    this.setInputElement();

    const initialUserName = this.userStore.snapshot().userName;

    this.inputEl.value = initialUserName ?? '';
  }
}
