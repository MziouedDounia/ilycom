import { LightningElement, api } from 'lwc';
import getCockpit from '@salesforce/apex/Cockpit360Controller.getCockpit';

export default class Cockpit360 extends LightningElement {
  @api recordId; // Account Id injected by Record Page

  account;
  subscriptions = [];
  requests = [];
  casesList = [];

  activeSubscriptionsCount = 0;
  openRequestsCount = 0;
  openCasesCount = 0;

  connectedCallback() {
    this.load();
  }

  async load() {
    try {
      const dto = await getCockpit({ accountId: this.recordId });

      this.account = dto.account;
      this.subscriptions = dto.subscriptions || [];
      this.requests = dto.requests || [];
      this.casesList = dto.casesList || [];

      this.activeSubscriptionsCount = dto.activeSubscriptionsCount || 0;
      this.openRequestsCount = dto.openRequestsCount || 0;
      this.openCasesCount = dto.openCasesCount || 0;
    } catch (e) {
      // You can show a toast later; for now just console
      // eslint-disable-next-line no-console
      console.error('Cockpit load error', e);
    }
  }
}
