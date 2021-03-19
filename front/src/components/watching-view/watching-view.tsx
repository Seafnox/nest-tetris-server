import { Component, h } from '@stencil/core';

@Component({
  tag: 'watching-view',
  styleUrl: 'watching-view.css',
  shadow: true,
})
export class WatchingView {
  public render(): string {
    return (
      <div>Watching</div>
    );
  }
}
