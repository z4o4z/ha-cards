import { css, html, ReactiveElement } from 'https://unpkg.com/lit-element@3.3.3/lit-element.js?module';

class NotificationsCard extends ReactiveElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    console.log(this.hass.states);

    return html`
      ${this.config.entities.map(({ title, entity, variant, message, condition }) => {
        const stateObj = this.hass.states[entity];

        if (!stateObj) {
          return this._card({ title: `Entity ${entity} not found.`, variant: 'not-found' });
        }

        if (!this._runCondition(condition, stateObj.state)) return '';

        return this._card({ title, variant, message });
      })}
    `;
  }

  setConfig(config) {
    if (!config.entities.length) {
      throw new Error('You need to define entities');
    }

    this.config = config;
  }

  _card({ title, variant, message }) {
    return html`
      <ha-card class="${variant}">
        <div class="title" title="${title}">${title}</div>
        ${message ? html`<div class="message">${message}</div>` : ''}
      </ha-card>
    `;
  }

  _runCondition(condition, value) {
    switch (condition.type) {
      case 'eq':
        return value === condition.value;
      case 'ne':
        return value !== condition.value;
      case 'lt':
        return value < condition.value;
      case 'gt':
        return value > condition.value;
      case 'lte':
        return value <= condition.value;
      case 'gte':
        return value >= condition.value;
      case 'includes':
        return value.includes(condition.value);
      case 'excludes':
        return !value.includes(condition.value);
      default:
        return false;
    }
  }

  _onOpen(entity) {
    const event = new Event('hass-more-info', { bubbles: true, composed: true });

    event.detail = { entityId: entity };

    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        direction: row;
      }
      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }
    `;
  }
}

globalThis.customElements.define('notifications-card', NotificationsCard);
