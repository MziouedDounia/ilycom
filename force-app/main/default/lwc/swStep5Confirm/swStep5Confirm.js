import { LightningElement, api } from 'lwc';

export default class SwStep5Confirm extends LightningElement {
    _isOpen = true;
    @api get isOpen() { return this._isOpen; }
    set isOpen(v) { this._isOpen = v === true || v === 'true'; }

    @api offerType;
    @api withEngagement;
    @api selectedPlan;
    @api selectedDevice;

    @api quoteNumber;
    @api accountId;
    @api planProductId;

    stopPropagation(e) {
        e.stopPropagation();
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    get hasDevice() {
        return !!this.selectedDevice;
    }

    get deviceName() {
        return this.selectedDevice?.name || this.selectedDevice?.Name || '';
    }

    get planName() {
        return this.selectedPlan?.name || this.selectedPlan?.Name || '';
    }

    get planPrice() {
        return this.selectedPlan?.price
            || this.selectedPlan?.Price__c
            || this.selectedPlan?.UnitPrice
            || '';
    }

    get planLine() {
        const eng = this.withEngagement ? '(Avec engagement)' : '(Sans engagement)';
        const price = this.planPrice ? ` - ${this.planPrice}/mois` : '';
        return `${this.planName} ${eng}${price}`;
    }

    get quoteNumberLabel() {
        return this.quoteNumber ? `#${this.quoteNumber}` : '';
    }

    back() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    submit() {
        this.dispatchEvent(new CustomEvent('submit', {
            detail: {
                accountId: this.accountId || null,
                planProductId: this.planProductId || this.selectedPlan?.productId || this.selectedPlan?.Product2Id || null
            }
        }));
    }
}
