import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'suspend-view',
  styleUrl: 'suspend-view.css',
  shadow: true,
})
export class SuspendView {

  render(): string {
    return (
      <Host>
        Suspend
      </Host>
    );
  }

}
