import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAccount from '@salesforce/apex/SubscriptionWizardController.getAccount';
import createSubscription from '@salesforce/apex/SubscriptionWizardController.createSubscription';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SubscriptionWizard extends NavigationMixin(LightningElement) {
    @api accountId; 
    step = 1;
    account;
    startDate;
    offerType; 
    withEngagement = true;
    engagementMonths = 12;
    penaltyAmount = 0;
    selectedPlan;
    selectedDevice;

    @wire(CurrentPageReference)
    setPageRef(pageRef) {
        const accId = pageRef?.state?.c__accountId;
        if (accId && accId !== this.accountId) {
            this.accountId = accId;
            this.loadAccount();
        }
    }

    connectedCallback() {
        this.loadAccount();
    }

    async loadAccount() {
        if (!this.accountId) return;
        try {
            this.account = await getAccount({ accountId: this.accountId });
        } catch (error) {
            console.error(error);
        }
    }

    get is1() { return this.step === 1; }
    get is2() { return this.step === 2; }
    get is3() { return this.step === 3; }
    get is4() { return this.step === 4; }
    get is5() { return this.step === 5; }

    get dot1() { return this.step >= 1 ? 'dot active' : 'dot'; }
    get dot2() { return this.step >= 2 ? 'dot active' : 'dot'; }
    get dot3() { return this.step >= 3 ? 'dot active' : 'dot'; }
    get dot4() { return this.step >= 4 ? 'dot active' : 'dot'; }
    get dot5() { return this.step >= 5 ? 'dot active' : 'dot'; }

    onBack = () => { 
        if (this.step > 1) this.step--; 
    };

    onNext1 = (e) => {
        this.accountId = e.detail.accountId;
        this.startDate = e.detail.startDate;
        this.step = 2;
        this.loadAccount();
    };

    onNext2 = (e) => {
        this.offerType = e.detail.offerType;
        this.step = 3;
    };

    onNext3 = (e) => {
        this.selectedPlan = e.detail.plan;
        this.withEngagement = e.detail.withEngagement;
        this.engagementMonths = e.detail.engagementMonths || 12;
        this.penaltyAmount = e.detail.penaltyAmount || 0;
        this.step = (this.offerType === 'Mobile') ? 4 : 5;
    };

    onSkip4 = () => {
        this.selectedDevice = null;
        this.step = 5;
    };

    onNext4 = (e) => {
        this.selectedDevice = e.detail.device || null;
        this.step = 5;
    };

    async onSubmit() {
        try {
            const req = {
                accountId: this.accountId,
                offerType: this.offerType,
                withEngagement: this.withEngagement,
                engagementMonths: this.withEngagement ? this.engagementMonths : null,
                penaltyAmount: this.withEngagement ? this.penaltyAmount : null,
                startDate: this.startDate,
                planProductId: this.selectedPlan?.productId,
                deviceProductId: this.selectedDevice?.productId
            };

            const res = await createSubscription({ req });
            
            this.dispatchEvent(new ShowToastEvent({
                title: 'Succès',
                message: 'Souscription créée avec succès',
                variant: 'success'
            }));

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: res.subscriptionId,
                    objectApiName: 'Subscription__c',
                    actionName: 'view'
                }
            });
        } catch (err) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Erreur',
                message: err?.body?.message || err?.message || 'Erreur inconnue',
                variant: 'error'
            }));
        }
    }
} 
