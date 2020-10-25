var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, customElement, html, LitElement, property } from 'https://unpkg.com/lit-element?module';
let GameField = class GameField extends LitElement {
    constructor() {
        super(...arguments);
        this.state = null;
    }
    render() {
        if (!this.state) {
            return html ``;
        }
        const state = JSON.parse(this.state);

        return state.map(row => {
            return html `<div class="row">${row.map(cell => {
                return html `<div class="cell ${cell === "" /* EMPTY */ ? 'empty' : ''}"></div>`;
            })}</div>`;
        });
    }
};
GameField.styles = css `
        :host {
            display: block;
            border: 2px solid #909090;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .row {
            display: flex;
        }
        
        .cell {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border: 4px solid #909090;
        }
        
        .cell.empty {
            border: 1px solid #666;
        }
    `;
__decorate([
    property()
], GameField.prototype, "state", void 0);
GameField = __decorate([
    customElement('game-field')
], GameField);
export { GameField };
//# sourceMappingURL=game-field.js.map
