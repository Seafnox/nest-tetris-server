var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from './lit-element.js';
let GameWrapper = class GameWrapper extends LitElement {
    constructor() {
        super(...arguments);
        this.state = null;
        this.nextItem = null;
        this.score = 0;
        this.level = 0;
    }
    render() {
        return html `
            <div class="header">
                <game-score score="${this.score}"></game-score>
                <game-level level="${this.level}"></game-level>
            </div>
            <div class="content">
                <game-field state="${this.state}"></game-field>
                <game-field class="next-item" state="${this.nextItem}"></game-field>
            </div>
        `;
    }
};
GameWrapper.styles = css `
        :host {
            display: block;
            border: 1px solid #909090;
        }
        
        .header {
            display: grid;
            grid-gap: 25px;
            grid-template-columns: 1fr 1fr;
        }
        
        .content {
            display: grid;
            grid-gap: 25px;
            grid-template-columns: 10fr 4fr;
        }
    `;
__decorate([
    property()
], GameWrapper.prototype, "state", void 0);
__decorate([
    property()
], GameWrapper.prototype, "nextItem", void 0);
__decorate([
    property()
], GameWrapper.prototype, "score", void 0);
__decorate([
    property()
], GameWrapper.prototype, "level", void 0);
GameWrapper = __decorate([
    customElement('game-wrapper')
], GameWrapper);
export { GameWrapper };
//# sourceMappingURL=game-wrapper.js.map
