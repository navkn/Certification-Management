import { LightningElement, wire, track } from 'lwc';

import addvoucher from '@salesforce/apex/CertificationManagementComponentsHandle.addNewVou';
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



export default class VouchersComp1 extends LightningElement {

    @wire(CurrentPageReference) pageRef;

    @track vouflag = false;

    addVou(event) {
        this.vouflag = true;
    }
    todaysDate;
    yesterdayDate;

    connectedCallback() {
        this.todaysDate = new Date();
        this.yesterdayDate = new Date();
        this.yesterdayDate.setDate(this.todaysDate.getDate() - 1);
        this.todaysDate = this.todaysDate.toISOString();
        this.yesterdayDate = this.yesterdayDate.toISOString();

    }
    closepopup() {
        this.vouflag = false;
        this.VouCost = undefined;
        this.VouVal = undefined;
        this.CertRecordId = undefined;
        this.VouCert = undefined;
    }

    @track VouVal;
    @track VouCost;
    @track VouCert;
    @track CertRecordId;
    VouCostChange(event) {
        this.VouCost = event.target.value;
    }
    VouValChange(event) {
        this.VouVal = event.target.value;
    }
    handleAutoSelect(event) {
        var nav = event.detail;
        this.VouCert = nav.selectedRecordName;
        this.CertRecordId = nav.selectedRecordId;
    }

    addNewVoucher(event) {
        // console.log(this.VouVal);
        // console.log(this.VouCost);
        // console.log(this.VouCert);
        // console.log(this.CertRecordId);
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            if (this.CertRecordId != undefined || this.CertRecordId != null) {
                addvoucher({ VouValid: this.VouVal, VouCost: this.VouCost, VouCert: this.CertRecordId }).then(result => {
                    if (result == 'Voucher Added Successfully') {
                        //alert(result);
                        this.notify('Voucher Added Successfully', '', 'success');
                        this.closepopup();
                        var payload = {};
                        fireEvent(this.pageRef, 'refreshvouchers', payload);
                        // this.showCert = false; refreshApex(this.valueOfViewCertifications).then(val => { this.showCert = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCert = true; });
                    }

                    else {
                        //alert(result);
                        this.notify('Failed to add voucher', result, 'error');
                    }
                });
            }
            else {
                //alert('Please select a Certification');
                this.notify('Please select a Certification', '', 'error');
            }
        }
        else {
            //alert('Please review all errors');
            this.notify('Please review all errors', '', 'error');
        }
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
    @track isAddAble = false;

    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'System Administrator' || this.profile == 'App Admin Profile') {
                this.isAddAble = true;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };
}