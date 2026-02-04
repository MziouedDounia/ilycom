import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SubscriptionsList extends NavigationMixin(LightningElement) {
  @api subscriptions = [];

  get hasSubs() {
    return this.subscriptions && this.subscriptions.length > 0;
  }

  openSubscription(e) {
    const subId = e.currentTarget.dataset.id;
    if (!subId) return;

    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: subId,
        objectApiName: 'Subscription__c',
        actionName: 'view'
      }
    });
  }
}
