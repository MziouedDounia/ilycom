import { LightningElement, api } from 'lwc';

export default class SwStep2OfferType extends LightningElement {
    @api offerType;
    selected;

    connectedCallback() { 
        this.selected = this.offerType; 
    }

    get mobileCls() { 
        return `card ${this.selected === 'Mobile' ? 'selected' : ''}`; 
    }

    get fixeCls() { 
        return `card ${this.selected === 'Fixe' ? 'selected' : ''}`; 
    }

    pick(e) { 
        this.selected = e.currentTarget.dataset.type; 
    }

    back() { 
        this.dispatchEvent(new CustomEvent('back')); 
    }

    next() {
        if (!this.selected) return;
        this.dispatchEvent(new CustomEvent('next', { 
            detail: { offerType: this.selected } 
        }));
    }
}