import { Component, Host, h, Listen, Element, ComponentInterface } from '@stencil/core';
import { generateId } from '../+helpers/generate-id';
import { InjectorFactory } from '../../services/Injector-factory';
import { UserStateService } from '../../services/user-state-service';

@Component({
  tag: 'login-view',
  styleUrl: 'login-view.css',
  shadow: true,
})
export class LoginView implements ComponentInterface {
  @Element() host: HTMLElement;

  private inputId = generateId('input');

  private inputEl: HTMLInputElement;
  private readonly userStateService: UserStateService;

  constructor() {
    this.userStateService = InjectorFactory.get().inject(UserStateService);
  }

  componentDidRender(): void {
    this.checkInputValue();
  }

  @Listen('keypress', {target: 'window'})
  public onWindowKeyPressed(event: KeyboardEvent): void {
    if (!this.inputEl) {
      this.setInputElement();
    }

    if (event.composedPath()[0] !== this.inputEl) {
      this.inputEl.focus();
    }

    debugger;

    if (event.code === 'Enter') {
      this.userStateService.patch({
        userName: this.inputEl.value,
      });
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
          <input class="input" id={this.inputId} type="text" maxlength="14" />
        </div>
      </Host>
    );
  }

  private checkInputValue() {
    this.setInputElement();

    const initialUserName = this.userStateService.snapshot().userName;

    this.inputEl.value = initialUserName ?? '';
  }
}
