import { LightningElement, api, track } from 'lwc';
import getPlans from '@salesforce/apex/SubscriptionWizardController.getPlans';
export default class SwStep3PlanSelect extends LightningElement {
  @api offerType;
  @api withEngagement;
  @api selectedPlan;
  @api engagementMonths;
  @api penaltyAmount;
  @track plans = [];
  loading = false;
  withEng = true;
  months = '12';
  penalty = 0;
get monthOptions() {
return [{ label:'12', value:'12' }, { label:'24', value:'24' }];
  }
connectedCallback() {
this.withEng = this.withEngagement ?? true;
this.months = String(this.engagementMonths ?? 12);
this.penalty = this.penaltyAmount ?? 0;
this.load();
  }
async load() {
this.loading = true;
const data = await getPlans({ offerType: this.offerType });
const selectedId = this.selectedPlan?.productId;
this.plans = (data || []).map(p => ({
      ...p,
_cls: `plan ${p.productId === selectedId ? 'selected' : ''}`
    }));
this.loading = false;
  }
onToggle(e) { this.withEng = e.target.checked; }
onMonths(e) { this.months = e.detail.value; }
onPenalty(e) { this.penalty = Number(e.target.value || 0); }
select(e) {
    const id = e.currentTarget.dataset.id;
    this.plans = this.plans.map(p => ({ 
        ...p, 
        _cls: `plan ${p.productId === id ? 'selected' : ''}` 
    }));
}

back() { this.dispatchEvent(new CustomEvent('back')); }
next() {
const chosen = this.plans.find(p => p._cls.includes('selected'));
if (!chosen) return;
this.dispatchEvent(new CustomEvent('next', {
detail: {
plan: chosen,
withEngagement: this.withEng,
engagementMonths: this.withEng ? Number(this.months) : null,
penaltyAmount: this.withEng ? Number(this.penalty) : null
      }
    }));
  }
}
