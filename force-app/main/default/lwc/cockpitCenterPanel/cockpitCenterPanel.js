import { LightningElement, api } from 'lwc';

export default class CockpitCenterPanel extends LightningElement {
  @api accountId;
  @api activeSubscriptionsCount = 0;
  @api openRequestsCount = 0;
  @api openCasesCount = 0;

  @api subscriptions = [];
  @api casesList = [];
}
