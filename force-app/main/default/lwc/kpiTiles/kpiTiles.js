import { LightningElement, api } from 'lwc';

export default class KpiTiles extends LightningElement {
  @api activeSubscriptionsCount = 0;
  @api openRequestsCount = 0;
  @api openCasesCount = 0;
}
