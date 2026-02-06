import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerIdentityCard extends NavigationMixin(LightningElement) {
  @api account;

  get accountName() {
    return this.account?.Name || '—';
  }

  get subtitle() {
    // adapt if you have a better field (Segment__c, Customer_Tier__c, etc.)
    return this.account?.Industry ? `${this.account.Industry}` : 'Compte client';
  }

  openAccount() {
    if (!this.account?.Id) return;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.account.Id,
        objectApiName: 'Account',
        actionName: 'view'
      }
    });
  }

  // demo button (optional)
  mockCreateRequest() {
    // later you can navigate to new Customer_Request__c record page
    // for now do nothing
  }
}
