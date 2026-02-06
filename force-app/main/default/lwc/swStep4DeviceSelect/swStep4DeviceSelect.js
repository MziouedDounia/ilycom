import { LightningElement, api, track } from 'lwc';
import getDevices from '@salesforce/apex/SubscriptionWizardController.getDevices';

export default class SwStep4DeviceSelect extends LightningElement {
    @api selectedDevice;
    @track devices = [];
    loading = false;

    connectedCallback() { this.load(); }

    async load() {
        this.loading = true;
        const data = await getDevices();
        const selectedId = this.selectedDevice?.productId;
        this.devices = (data || []).map(d => ({
            ...d,
            _cls: `device ${d.productId === selectedId ? 'selected' : ''}`
        }));
        this.loading = false;
    }

    select(e) {
        const id = e.currentTarget.dataset.id;
        this.devices = this.devices.map(d => ({ 
            ...d, 
            _cls: `device ${d.productId === id ? 'selected' : ''}` 
        }));
    }

    back() { this.dispatchEvent(new CustomEvent('back')); }
    skip() { this.dispatchEvent(new CustomEvent('skip')); }

    next() {
        const chosen = this.devices.find(d => d._cls.includes('selected'));
        this.dispatchEvent(new CustomEvent('next', { 
            detail: { device: chosen || null } 
        }));
    }
}