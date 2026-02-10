import { LightningElement, api, track } from 'lwc';

export default class SwStep3PlanSelect extends LightningElement {
    // inputs depuis le parent
    @api offerType; // "Mobile" ou "Fixe"
    @api withEngagement;
    @api selectedPlan;
    @api engagementMonths;

    // popup
    _isOpen = true;
    @api get isOpen() { return this._isOpen; }
    set isOpen(v) { this._isOpen = v === true || v === 'true'; }

    // state
    @track plans = [];
    loading = false;

    withEng = true;
    months = '12';

    // ✅ Règles d’augmentation (tu peux changer facilement)
    // - Sans engagement: +20%
    // - 24 mois: +10%
    NO_ENG_MULTIPLIER = 1.50;   // +50% sans engagement (si tu veux)
    MONTH_24_MULTIPLIER = 0.95; // -5% pour 24 mois ✅

     

    // ✅ Data OFFRE (basePriceNum = prix de base)
    mobilePlans = [
        { productId: 'M5',   name: 'Forfait Mobile 5Go',   description: 'Appels illimités',        basePriceNum: 9.99 },
        { productId: 'M20',  name: 'Forfait Mobile 20Go',  description: 'Appels + SMS illimités', basePriceNum: 14.99 },
        { productId: 'M50',  name: 'Forfait Mobile 50Go',  description: 'Appels + SMS illimités', basePriceNum: 19.99 },
        { productId: 'M100', name: 'Forfait Mobile 100Go', description: 'Appels + SMS illimités', basePriceNum: 24.99 }
    ];

    fixePlans = [
        { productId: 'F20',  name: 'Offre Fibre + Fixe 20Mo',  description: 'Internet / Fibre', basePriceNum: 19.99 },
        { productId: 'F100', name: 'Offre Fibre + Fixe 100Mo', description: 'Internet / Fibre', basePriceNum: 29.99 }
    ];

    get monthOptions() {
        return [
            { label: '12', value: '12' },
            { label: '24', value: '24' }
        ];
    }

    get offerTypeLabel() {
        return this.offerType === 'Fixe' ? 'Fixe' : 'Mobile';
    }

    get withEngLeftCls() {
        return `muted ${this.withEng ? 'mutedActive' : ''}`;
    }
    get withEngRightCls() {
        return `muted ${!this.withEng ? 'mutedActive' : ''}`;
    }

    _selectedId = null;

    connectedCallback() {
        this.withEng = this.withEngagement ?? true;
        this.months = String(this.engagementMonths ?? 12);
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    onToggle(e) {
        this.withEng = e.target.checked;
        // quand tu changes le toggle, le getter displayPlans recalcule automatiquement les prix ✅
    }

    handleMonthChange(e) {
        this.months = e.detail.value;
        // quand tu changes 12/24, displayPlans recalcule automatiquement ✅
    }

    selectPlan(e) {
        this._selectedId = e.currentTarget.dataset.id;
    }

    get disableNext() {
        return !this._selectedId && !this.selectedPlan?.productId;
    }

    back() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    // ✅ calcul prix final selon toggle + durée
          computeFinalPrice(basePrice) {
          let finalPrice = Number(basePrice);

          // Sans engagement => augmentation
          if (!this.withEng) {
              finalPrice *= this.NO_ENG_MULTIPLIER;
          }

          // 24 mois => -5% (discount)
          if (String(this.months) === '24') {
              finalPrice *= this.MONTH_24_MULTIPLIER;
          }

          return finalPrice;
      }
      toggleEngagement() {
    this.withEng = !this.withEng;
}

get thumbClass() {
    return `switch-thumb ${this.withEng ? 'left' : 'right'}`;
}

get leftLabelClass() {
    return `switch-label ${this.withEng ? 'active' : ''}`;
}

get rightLabelClass() {
    return `switch-label ${!this.withEng ? 'active' : ''}`;
}


    formatPriceEUR(num) {
        // "19,99€"
        return `${num.toFixed(2).replace('.', ',')}€`;
    }

    // ✅ Plans affichés selon offerType + prix dynamique
    get displayPlans() {
        const base = this.offerType === 'Fixe' ? this.fixePlans : this.mobilePlans;
        const selectedId = this.selectedPlan?.productId;

        return base.map((p) => {
            const final = this.computeFinalPrice(p.basePriceNum);
            return {
                ...p,
                price: this.formatPriceEUR(final),
                _cls: `plan ${this._selectedId === p.productId || p.productId === selectedId ? 'selected' : ''}`
            };
        });
    }

    next() {
        const list = this.offerType === 'Fixe' ? this.fixePlans : this.mobilePlans;
        const id = this._selectedId || this.selectedPlan?.productId;
        const chosen = list.find((p) => p.productId === id);
        if (!chosen) return;

        const finalNum = this.computeFinalPrice(chosen.basePriceNum);

        this.dispatchEvent(
            new CustomEvent('next', {
                detail: {
                    plan: {
                        ...chosen,
                        price: this.formatPriceEUR(finalNum) // prix final renvoyé au parent ✅
                    },
                    withEngagement: this.withEng,
                    engagementMonths: this.withEng ? Number(this.months) : null
                }
            })
        );
    }
}
