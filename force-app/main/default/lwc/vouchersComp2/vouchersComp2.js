import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import viewvouchers from '@salesforce/apex/CertificationManagementComponentsHandle.getAllVouchers';
import delVou from '@salesforce/apex/CertificationManagementComponentsHandle.delVou';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


const columnsOfVou = [{ label: 'Voucher Code', fieldName: 'Name' },
{ label: 'Certification', fieldName: 'Certification__r.Name' },
{ label: 'Active', fieldName: 'Active__c', type: 'boolean' },
{ label: 'Validity', fieldName: 'Validity__c', type: 'date' },
{ label: 'Cost', fieldName: 'Voucher_Cost__c', type: 'currency' },

];
export default class VouchersComp2 extends LightningElement {

    isPhone;
    renderedCallback() {
        console.log('inside render');
        //console.log(isPhone);
        this.isPhone = navigator.platform;
        console.log(this.isPhone);

    }
    @track columnsOfVou = columnsOfVou;

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('refreshvouchers', this.handle1, this);
        console.log('is it phone?');

    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handle1(payload) {
        console.log('handled');
        if (this.firstTime == true) { this.firstTime = false; }
        else {
            
            this.showVouchers = false;
             refreshApex(this.valueOfViewVouchers).then(val => { this.showVouchers = true; console.log('came'); }).catch(err => { console.log('error came'); this.showVouchers = true; });
        }
    }
    @track showVouchers = false;
    @track vouchers;
    valueOfViewVouchers;
    @track firstTime = false;//It initializes to true by default
    @wire(viewvouchers, { flag: '$firstTime' })
    getApexData1(value) {
        this.valueOfViewVouchers = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.vouchers = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        //this.showCert = true;
        this.showVouchers = true;
    };

    editForm(event) {
        //alert(event.target.value);
        var payload = { data: this.vouchers[event.target.value], action: 'edit' };
        fireEvent(this.pageRef, 'editvoucher', payload);
        console.log(payload);
        console.log();
    }

    viewForm(event) {
        //alert(event.target.value);
        console.log(event.target.parentNode.rowIndex);
        var ind = event.target.parentNode.rowIndex;
        ind = ind - 1;
        var payload = { data: this.vouchers[ind], action: 'view' };
        fireEvent(this.pageRef, 'editvoucher', payload);
        console.log(payload);
    }
    viewForm1(event) {
        //alert(event.target.value);

        var payload = { data: this.vouchers[event.target.value], action: 'view' };
        fireEvent(this.pageRef, 'editvoucher', payload);
        console.log(payload);
    }

    notify(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    //getting user profile
    @track error = 'hai';
    @track isprofile;
    @track isUpdateAble = false;
    @track isDeleteAble = false;

    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'System Administrator' || this.profile == 'App Admin Profile') {
                this.isUpdateAble = true;
            }
            if (this.profile == 'System Administrator') {
                this.isDeleteAble = true;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };

    deleteVoucher(event) {
        var payload = this.vouchers[event.target.value];
        console.log(event.target.value);
        console.log(payload);
        console.log(payload.Id);
        delVou({ recId: payload.Id }).then((result) => {
            if (result == "Voucher deleted Successfully") {
                refreshApex(this.valueOfViewVouchers);
                this.notify('Voucher deleted Successfully', '', 'success');
            } else {
                this.notify('Failed to delete voucher', result, 'error');
            };
        });
    }

}