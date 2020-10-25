var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from 'https://unpkg.com/lit-element?module';
let GameLevel = class GameLevel extends LitElement {
    constructor() {
        super(...arguments);
        this.level = 0;
    }
    render() {
        return html `${this.level}`;
    }
};
GameLevel.styles = css `
        :host {
            display: block;
            font-size: 3em;
        }
    `;
__decorate([
    property()
], GameLevel.prototype, "level", void 0);
GameLevel = __decorate([
    customElement('game-level')
], GameLevel);
export { GameLevel };
//# sourceMappingURL=game-level.js.map
