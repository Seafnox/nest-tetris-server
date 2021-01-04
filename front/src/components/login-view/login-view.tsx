import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'login-view',
  styleUrl: 'login-view.css',
  shadow: true,
})
export class LoginView {

  render(): string {
    return (
      <Host>
        <div class="form">
          <h3 class="title">What's your nickname?</h3>
          <input id="usernameInput" type="text" maxlength="14" />
        </div>
      </Host>
    );
  }

}
