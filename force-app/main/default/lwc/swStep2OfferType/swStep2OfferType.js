import { LightningElement, api } from 'lwc';

export default class SwStep2OfferType extends LightningElement {
    @api offerType;

    // Popup open/close (comme step1)
    _isOpen = true;
    @api get isOpen() { return this._isOpen; }
    set isOpen(v) { this._isOpen = v === true || v === 'true'; }

    selected = null;

    connectedCallback() {
        this.selected = this.offerType || null;
    }

    get mobileCls() {
        return `card ${this.selected === 'Mobile' ? 'selected' : ''}`;
    }

    get fixeCls() {
        return `card ${this.selected === 'Fixe' ? 'selected' : ''}`;
    }

    get disableNext() {
        return !this.selected;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    // Click backdrop => cancel
    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    pick(event) {
        this.selected = event.currentTarget.dataset.type;
    }

    back() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    next() {
        if (!this.selected) return;

        this.dispatchEvent(
            new CustomEvent('next', {
                detail: { offerType: this.selected }
            })
        );
    }
}
