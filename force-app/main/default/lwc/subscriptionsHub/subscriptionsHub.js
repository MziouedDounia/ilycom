import { LightningElement, api, track } from 'lwc';
import search from '@salesforce/apex/SubscriptionSearchController.search';
import { NavigationMixin } from 'lightning/navigation';

export default class SubscriptionsHub extends NavigationMixin(LightningElement) {
  @api accountId;
  @track keyword = '';
  @track rows = [];

  columns = [
    {
      label: 'Contrat',
      type: 'button',
      typeAttributes: {
        label: { fieldName: 'Name' },
        name: 'openCockpit',
        variant: 'base'
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
      accountId: r.Account__c
    }));
  }

  handleSearchChange(e) {
    this.keyword = e.target.value;
    window.clearTimeout(this._t);
    this._t = window.setTimeout(() => this.load(), 250);
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    if (actionName === 'openCockpit') {
      // IMPORTANT: apiName must match your tab name in the URL after /n/
      // In your case it's Cockpit360
      this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
          apiName: 'Cockpit360'
        },
        state: {
          c__accountId: row.accountId
        }
      });
    }
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