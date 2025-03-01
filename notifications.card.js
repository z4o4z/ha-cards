import { css, html, LitElement } from 'https://unpkg.com/lit-element@3.3.3/lit-element.js?module';

class NotificationsCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    return html`
      ${this.config.entities.map(({ title, entity, variant, message, condition }) => {
        const stateObj = this.hass.states[entity];

        if (!stateObj) {
          return this._card({ title: `Entity ${entity} not found.`, variant: 'not-found' });
        }

        if (!this._runCondition(condition, stateObj.state)) return '';

        return this._card({ title, entity, variant, message });
      })}
    `;
  }

  setConfig(config) {
    if (!config.entities.length) {
      throw new Error('You need to define entities');
    }

    this.config = config;
  }

  _card({ title, entity, variant, message }) {
    return html`
      <ha-card class="${variant}" @click=${() => this._onOpen(entity)}>
        <ha-svg-icon .path=${this._icon(variant)}> </ha-svg-icon>
        <ha-tile-info .primary="${title}" .secondary="${message}"></ha-tile-info>
      </ha-card>
    `;
  }

  _runCondition(condition, value) {
    const typedValue = typeof condition.value === 'string' ? String(value) : Number(value);

    switch (condition.type) {
      case 'eq':
        return typedValue === condition.value;
      case 'ne':
        return typedValue !== condition.value;
      case 'lt':
        return typedValue < condition.value;
      case 'gt':
        return typedValue > condition.value;
      case 'lte':
        return typedValue <= condition.value;
      case 'gte':
        return typedValue >= condition.value;
      case 'btw':
        return typedValue > condition.value[0] && typedValue < condition.value[1];
      case 'btwi':
        return typedValue >= condition.value[0] && typedValue <= condition.value[1];
      default:
        return false;
    }
  }

  _onOpen(entity) {
    console.log(entity);

    if (!entity) return;

    const event = new Event('hass-more-info', { bubbles: true, composed: true });

    event.detail = { entityId: entity };

    this.dispatchEvent(event);
  }

  _icon(variant) {
    switch (variant) {
      case 'error':
        return 'M2.2,16.06L3.88,12L2.2,7.94L6.26,6.26L7.94,2.2L12,3.88L16.06,2.2L17.74,6.26L21.8,7.94L20.12,12L21.8,16.06L17.74,17.74L16.06,21.8L12,20.12L7.94,21.8L6.26,17.74L2.2,16.06M13,17V15H11V17H13M13,13V7H11V13H13Z';
      case 'warning':
        return 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
      case 'info':
        return 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
      case 'success':
        return 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z';
      case 'not-found':
        return 'M20.96 21C19.9 21 18.9 20.74 17.96 20.24C16.12 21.24 13.81 21.24 11.97 20.24C10.13 21.24 7.82 21.24 6 20.24C4.77 20.93 3.36 21.04 2 21V19C3.41 19.04 4.77 18.89 6 18C7.74 19.24 10.21 19.24 11.97 18C13.74 19.24 16.2 19.24 17.96 18C19.17 18.89 20.54 19.04 21.94 19V21H20.96M22 3.5L7.11 5.96L13.11 12.17L22 3.5M10.81 16.36L11.97 15.54L13.12 16.36C13.65 16.72 14.3 16.93 14.97 16.93C15.12 16.93 15.28 16.91 15.43 16.89L5.2 6.31C4.29 7.65 3.9 9.32 4 10.92L9.74 16.83C10.13 16.74 10.5 16.58 10.81 16.36Z';
      default:
        return 'M15.9,18.45C17.25,18.45 18.35,17.35 18.35,16C18.35,14.65 17.25,13.55 15.9,13.55C14.54,13.55 13.45,14.65 13.45,16C13.45,17.35 14.54,18.45 15.9,18.45M21.1,16.68L22.58,17.84C22.71,17.95 22.75,18.13 22.66,18.29L21.26,20.71C21.17,20.86 21,20.92 20.83,20.86L19.09,20.16C18.73,20.44 18.33,20.67 17.91,20.85L17.64,22.7C17.62,22.87 17.47,23 17.3,23H14.5C14.32,23 14.18,22.87 14.15,22.7L13.89,20.85C13.46,20.67 13.07,20.44 12.71,20.16L10.96,20.86C10.81,20.92 10.62,20.86 10.54,20.71L9.14,18.29C9.05,18.13 9.09,17.95 9.22,17.84L10.7,16.68L10.65,16L10.7,15.31L9.22,14.16C9.09,14.05 9.05,13.86 9.14,13.71L10.54,11.29C10.62,11.13 10.81,11.07 10.96,11.13L12.71,11.84C13.07,11.56 13.46,11.32 13.89,11.15L14.15,9.29C14.18,9.13 14.32,9 14.5,9H17.3C17.47,9 17.62,9.13 17.64,9.29L17.91,11.15C18.33,11.32 18.73,11.56 19.09,11.84L20.83,11.13C21,11.07 21.17,11.13 21.26,11.29L22.66,13.71C22.75,13.86 22.71,14.05 22.58,14.16L21.1,15.31L21.15,16L21.1,16.68M6.69,8.07C7.56,8.07 8.26,7.37 8.26,6.5C8.26,5.63 7.56,4.92 6.69,4.92A1.58,1.58 0 0,0 5.11,6.5C5.11,7.37 5.82,8.07 6.69,8.07M10.03,6.94L11,7.68C11.07,7.75 11.09,7.87 11.03,7.97L10.13,9.53C10.08,9.63 9.96,9.67 9.86,9.63L8.74,9.18L8,9.62L7.81,10.81C7.79,10.92 7.7,11 7.59,11H5.79C5.67,11 5.58,10.92 5.56,10.81L5.4,9.62L4.64,9.18L3.5,9.63C3.41,9.67 3.3,9.63 3.24,9.53L2.34,7.97C2.28,7.87 2.31,7.75 2.39,7.68L3.34,6.94L3.31,6.5L3.34,6.06L2.39,5.32C2.31,5.25 2.28,5.13 2.34,5.03L3.24,3.47C3.3,3.37 3.41,3.33 3.5,3.37L4.63,3.82L5.4,3.38L5.56,2.19C5.58,2.08 5.67,2 5.79,2H7.59C7.7,2 7.79,2.08 7.81,2.19L8,3.38L8.74,3.82L9.86,3.37C9.96,3.33 10.08,3.37 10.13,3.47L11.03,5.03C11.09,5.13 11.07,5.25 11,5.32L10.03,6.06L10.06,6.5L10.03,6.94Z';
    }
  }

  static get styles() {
    return css`
      :host ha-card {
        gap: 10px;
        cursor: pointer;
        display: flex;
        padding: 10px;
        direction: column;
      }

      :host ha-card.error {
        background: var(--red-color);
      }
      :host ha-card.not-found {
        background: var(--brown-color);
      }

      :host ha-card.warning {
        background: var(--orange-color);
      }

      :host ha-card.info {
        background: var(--green-color);
      }

      :host ha-card.success {
        background: var(--green-color);
      }
    `;
  }
}

globalThis.customElements.define('notifications-card', NotificationsCard);
