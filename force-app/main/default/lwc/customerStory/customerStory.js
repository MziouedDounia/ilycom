import { LightningElement, api } from 'lwc';

export default class CustomerStory extends LightningElement {
  @api requests = [];

  get hasRequests() {
    return this.requests && this.requests.length > 0;
  }
}
