import { LightningElement, api } from 'lwc';

export default class SwStep5Confirm extends LightningElement {
    @api account;
    @api offerType;
    @api withEngagement;
    @api selectedPlan;
    @api selectedDevice;
    @api startDate;
    @api engagementMonths;
    @api penaltyAmount;

   get engText() {
    if (!this.withEngagement) return 'Sans engagement';
    return `Avec engagement (${this.engagementMonths || 12} mois) — pénalité ${this.penaltyAmount || 0}€`; 
}

    back() { this.dispatchEvent(new CustomEvent('back')); }
    submit() { this.dispatchEvent(new CustomEvent('submit')); }
}