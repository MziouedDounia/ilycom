import { LightningElement, api, track } from 'lwc';
import DEVICE_IMAGES from '@salesforce/resourceUrl/DeviceImages';

export default class SwStep4DeviceSelect extends LightningElement {
    @api selectedDevice;

    // popup open/close
    _isOpen = true;
    @api get isOpen() { return this._isOpen; }
    set isOpen(v) { this._isOpen = v === true || v === 'true'; }

    @track devices = [];
    loading = false;

    connectedCallback() {
        this.loadStatic();
    }

    // ✅ Liste statique (tu peux modifier prix/desc)
    loadStatic() {
        const selectedId = this.selectedDevice?.productId;

                            const data = [
                    {
                        productId: 'D_IP13_BLUE',
                        name: 'iPhone 13 Bleu',
                        description: '128Go • iOS',
                        price: '—',
                        imageUrl: `${DEVICE_IMAGES}/DeviceImages/iphone13_blue.png`
                    },
                    {
                        productId: 'D_S22',
                        name: 'Samsung Galaxy S22',
                        description: '128Go • Android',
                        price: '—',
                        imageUrl: `${DEVICE_IMAGES}/DeviceImages/samsung_s22.png`
                    },
                    {
                        productId: 'D_S24U',
                        name: 'Samsung Galaxy S24 Ultra',
                        description: '256Go • Android',
                        price: '—',
                        imageUrl: `${DEVICE_IMAGES}/DeviceImages/samsung_s24_ultra.png`
                    },
                    {
                        productId: 'D_IP15_PRO',
                        name: 'iPhone 15 Pro',
                        description: '256Go • iOS',
                        price: '—',
                        imageUrl: `${DEVICE_IMAGES}/DeviceImages/iphone15_pro.png`
                    }
                    ];

        

        this.devices = data.map(d => ({
            ...d,
            _cls: `device ${d.productId === selectedId ? 'selected' : ''}`
        }));
    }

    stopPropagation(e) { e.stopPropagation(); }

    handleCancel() {
        // click outside -> same as skip
        this.dispatchEvent(new CustomEvent('skip'));
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
