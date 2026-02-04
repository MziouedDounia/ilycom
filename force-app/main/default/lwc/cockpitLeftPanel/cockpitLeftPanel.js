import { LightningElement, api } from 'lwc';

export default class CockpitLeftPanel extends LightningElement {
  @api account;
  @api requests = [];
}
