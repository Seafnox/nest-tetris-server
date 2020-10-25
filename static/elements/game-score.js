var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from 'https://unpkg.com/lit-element?module';
let GameScore = class GameScore extends LitElement {
    constructor() {
        super(...arguments);
        this.score = 0;
    }
    render() {
        return html `${this.score}`;
    }
};
GameScore.styles = css `
        :host {
            display: block;
            font-size: 5em;
        }
    `;
__decorate([
    property()
], GameScore.prototype, "score", void 0);
GameScore = __decorate([
    customElement('game-score')
], GameScore);
export { GameScore };
//# sourceMappingURL=game-score.js.map
