import { LightningElement, api, track } from 'lwc';
import search from '@salesforce/apex/SubscriptionSearchController.search';
import { NavigationMixin } from 'lightning/navigation';

export default class SubscriptionsHub extends NavigationMixin(LightningElement) {
  @api accountId; // if used on Account page, Salesforce provides the recordId here
  @track keyword = '';
  @track rows = [];

  // ✅ "Contrat" becomes clickable and opens Account Cockpit (Account record page)
  columns = [
    {
      label: 'Contrat',
      fieldName: 'accountUrl',
      type: 'url',
      typeAttributes: {
        label: { fieldName: 'Name' },
        target: '_self'
      }
    },
    { label: 'Client', fieldName: 'accountName' },
    { label: 'Statut', fieldName: 'Status__c' },
    { label: 'Début', fieldName: 'Start_Date__c', type: 'date' },
    { label: 'Fin', fieldName: 'End_Date__c', type: 'date' }
  ];

  connectedCallback() {
    this.load();
  }

  async load() {
    const data = await search({ keyword: this.keyword, accountId: this.accountId });

    this.rows = (data || []).map((r) => ({
      ...r,
      accountName: r.Account__r ? r.Account__r.Name : '',
      accountUrl: r.Account__c ? `/lightning/r/Account/${r.Account__c}/view` : null
    }));
  }

  handleSearchChange(e) {
    this.keyword = e.target.value;
    window.clearTimeout(this._t);
    this._t = window.setTimeout(() => this.load(), 250);
  }

  goToNewSubscription() {
this[NavigationMixin.Navigate]({
type: 'standard__navItemPage',
attributes: {
apiName: 'New_Subscription_Wizard' // <-- the TAB Developer Name
    },
state: {
c__accountId: this.accountId // optional: if SubscriptionsHub is on Account 
    }
  });
}
}
