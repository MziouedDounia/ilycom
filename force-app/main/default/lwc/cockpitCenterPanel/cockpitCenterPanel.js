import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CockpitCenterPanel extends NavigationMixin(LightningElement) {
  @api accountId;
  @api activeSubscriptionsCount = 0;
  @api openRequestsCount = 0;
  @api openCasesCount = 0;
  @api subscriptions = [];
  @api casesList = [];

  tab = 'overview';
  selectedSubId;

  get hasSubs() {
    return this.subscriptions && this.subscriptions.length > 0;
  }

  connectedCallback() {
    // auto select first subscription
    if (this.hasSubs && !this.selectedSubId) {
      this.selectedSubId = this.subscriptions[0].Id;
    }
  }

  // tabs
  onTab(e) {
    this.tab = e.currentTarget.dataset.tab;
  }
  get tabClassOverview() { return this.tab === 'overview' ? 't active' : 't'; }
  get tabClassOffers() { return this.tab === 'offers' ? 't active' : 't'; }
  get tabClassRelated() { return this.tab === 'related' ? 't active' : 't'; }
  get tabClassSettings() { return this.tab === 'settings' ? 't active' : 't'; }

  // selection
  selectSub(e) {
    this.selectedSubId = e.currentTarget.dataset.id;
  }

  get selected() {
    return this.subscriptions?.find(s => s.Id === this.selectedSubId) || this.subscriptions?.[0];
  }

  get selectedTitle() {
    return this.selected?.Name || 'Détails abonnement';
  }
  get selectedStatus() {
    return this.selected?.Status__c || '—';
  }
  get selectedPeriod() {
    const s = this.selected;
    if (!s) return '—';
    return `${s.Start_Date__c || '—'} → ${s.End_Date__c || '—'}`;
  }

  openSelected() {
    if (!this.selected?.Id) return;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.selected.Id,
        objectApiName: 'Subscription__c',
        actionName: 'view'
      }
    });
  }

  // demo
  mockCreateCase() {}
}
