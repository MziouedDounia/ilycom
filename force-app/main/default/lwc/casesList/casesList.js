import { LightningElement, api } from 'lwc';

export default class CasesList extends LightningElement {
  @api casesList = [];

  get hasCases() {
    return this.casesList && this.casesList.length > 0;
  }
}
