import { LightningElement, api } from 'lwc';

export default class SwStep1CustomerInfo extends LightningElement {

    @api accountName;
    @api BillingAddress;
    @api Phone;

    localAccountName = '';
    localAddress = '';
    localPhone = '';

    connectedCallback() {
        this.localAccountName = this.accountName || '';
        this.localAddress = this.BillingAddress || '';
        this.localPhone = this.Phone || '';
    }

    handleName(event) {
        this.localAccountName = event.target.value;
    }

    handleAddress(event) {
        this.localAddress = event.target.value;
    }

    handlePhone(event) {
        this.localPhone = event.target.value;
    }

    next() {
        this.dispatchEvent(
            new CustomEvent('next', {
                detail: {
                    accountName: this.localAccountName,
                    BillingAddress: this.localAddress,
                    Phone: this.localPhone
                }
            })
        );
    }
}
