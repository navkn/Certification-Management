import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updVoucher from '@salesforce/apex/CertificationManagementComponentsHandle.updVoucher';

export default class VouchersComp3 extends LightningElement {


    @track isEdit = true;

    @wire(CurrentPageReference) pageRef;
    todaysDate;
    yesterdayDate;

    connectedCallback() {
        this.todaysDate = new Date();
        this.yesterdayDate = new Date();
        this.yesterdayDate.setDate(this.todaysDate.getDate() - 1);
        this.todaysDate = this.todaysDate.toISOString();
        this.yesterdayDate = this.yesterdayDate.toISOString();
        registerListener('editvoucher', this.handle1, this);

    }
    
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    @wire(CurrentPageReference) pageRef;

    notify(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
    handleEditClicked(event) {
        this.isEdit = true;
    }
    @track voucher;
    payload;
    @track jsonVouCert;
    handle1(heavyLoad) {
        this.payload = heavyLoad.data;
        this.voucher = this.payload;
        this.vouVal = this.voucher.Validity__c;
        this.vouCost = this.voucher.Voucher_Cost__c;
        this.vouCert = this.voucher.Certification__r.Name;
        this.CertRecordId = this.voucher.Certification__r.Id;
        this.jsonVouCert = { 'Name': this.vouCert, 'Id': this.CertRecordId };
        this.vouName = this.voucher.Name;
        this.recordId = this.voucher.Id;
        this.isActive = this.voucher.Active__c;
        console.log(this.isActive);
        if (this.isActive == false) {
            this.isEditable = false;
        }
        else {
            this.isEditable = true;
        }
        if (heavyLoad.action == 'view') {
            this.isEdit = false;
            console.log(this.isEdit);
        }
        if (heavyLoad.action == 'edit') {
            this.isEdit = true;
            console.log(this.isEdit);
        }

        //autoscroll
        var scrollOptions = {
            //left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }

    handleCancel(event) {
        this.isEdit = false;
    }


    handleAutoSelect(event) {
        var nav = event.detail;
        this.VouCert = nav.selectedRecordName;
        this.CertRecordId = nav.selectedRecordId;
    }

    handleUpdate(event) {
        console.log(this.vouCost);
        console.log(this.CertRecordId);
        console.log(this.vouVal);
        if (this.isActive == true) {
            updVoucher({ recId: this.recordId, vouCost: this.vouCost, vouValidity: this.vouVal, vouCert: this.CertRecordId }).then((result) => {
                if (result == "Voucher updated Successfully") {
                    //refreshApex(this.valueOfViewCertifications);
                    var payload = {};
                    fireEvent(this.pageRef, 'refreshvouchers', payload);
                    this.handleCancel(payload);
                    this.notify('Voucher updated Successfully', '', 'success');
                    this.voucher = undefined;
                } else {
                    this.notify('Failed to update certificate', result, 'error');
                };
            });
        }
        else {
            this.notify('A inactive Voucher cannot be updated', '', 'error');
        }
    }
    @track vouVal;
    @track vouCert;
    @track vouCost;
    @track vouName;
    @track isActive;
    recordId;
    @track CertRecordId;

    VouCostChange(event) {
        this.vouCost = event.target.value;
        // console.log(this.certCost);
    }

    VouValChange(event) {
        this.vouVal = event.target.value;
        // console.log(this.certCost);
    }
    VouCertChange(event) {
        this.vouCert = event.target.value;
        // console.log(this.certCost);
    }

    //getting user profile
    @track error = 'hai';
    @track isprofile;
    @track isEditable = false;
    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'System Administrator' || this.profile == 'App Admin Profile') {
                this.isEditable = true;
                console.log(this.isEditable);
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };


}