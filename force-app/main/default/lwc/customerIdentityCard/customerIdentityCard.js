import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomerIdentityCard extends NavigationMixin(LightningElement) {
  @api account;

  get accountName() {
    return this.account?.Name || '—';
  }

  get phone() {
    return this.account?.Phone;
  }

  get email() {
    // PersonEmail exists only for Person Accounts; ignore if not present
    return this.account?.PersonEmail;
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
}
