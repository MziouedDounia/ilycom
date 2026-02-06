import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getCockpit from '@salesforce/apex/Cockpit360Controller.getCockpit';

export default class Cockpit360 extends LightningElement {
  accountId; // <-- from URL (App Page)
  account;
  subscriptions = [];
  requests = [];
  casesList = [];

  activeSubscriptionsCount = 0;
  openRequestsCount = 0;
  openCasesCount = 0;

  @wire(CurrentPageReference)
  getState(pageRef) {
    const id = pageRef?.state?.c__accountId;
    if (id && id !== this.accountId) {
      this.accountId = id;
      this.load(); // reload when account changes
    }
  }

  async load() {
    if (!this.accountId) return; // important

    try {
      const dto = await getCockpit({ accountId: this.accountId });

      this.account = dto.account;
      this.subscriptions = dto.subscriptions || [];
      this.requests = dto.requests || [];
      this.casesList = dto.casesList || [];

      this.activeSubscriptionsCount = dto.activeSubscriptionsCount || 0;
      this.openRequestsCount = dto.openRequestsCount || 0;
      this.openCasesCount = dto.openCasesCount || 0;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Cockpit load error', e);
    }
  }
}
