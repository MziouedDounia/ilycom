import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SwStep1CustomerInfo extends NavigationMixin(LightningElement) {

    @api currentStep = 1;

    _isOpen = true;
    @api get isOpen() { return this._isOpen; }
    set isOpen(v) { this._isOpen = v === true || v === 'true'; }

    localAccountName = '';
    localAddress = '';
    localPhone = '';

    handleName(e) { this.localAccountName = e.target.value; }
    handleAddress(e) { this.localAddress = e.target.value; }
    handlePhone(e) { this.localPhone = e.target.value; }

    stopPropagation(e) { e.stopPropagation(); }

    // ✅ Annuler → SubscriptionsHub
    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'SubscriptionsHub'
            }
        });
    }

    next() {
        this.dispatchEvent(new CustomEvent('next', {
            detail: {
                accountName: this.localAccountName,
                BillingAddress: this.localAddress,
                Phone: this.localPhone
            }
        }));
    }

    // Step classes
    get step1Class() { return this.getStepClass(1); }
    get step2Class() { return this.getStepClass(2); }
    get step3Class() { return this.getStepClass(3); }
    get step4Class() { return this.getStepClass(4); }
    get step5Class() { return this.getStepClass(5); }

    getStepClass(n) {
        if (n === this.currentStep) return 'step active';
        if (n < this.currentStep) return 'step done';
        return 'step';
    }
}
