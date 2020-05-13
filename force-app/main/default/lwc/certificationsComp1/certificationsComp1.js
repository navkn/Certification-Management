import { LightningElement, wire, track } from 'lwc';

import addcertification from '@salesforce/apex/CertificationManagementComponentsHandle.addNewCert';
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CertificationsComp1 extends LightningElement {

    @wire(CurrentPageReference) pageRef;

    @track certflag = false;

    addCert(event) {
        this.certflag = true;
    }

    closepopup() {
        this.certflag = false;
        this.CertCost = undefined;
        this.CertName = undefined;
    }

    @track CertName;
    @track CertCost;
    CertCostChange(event) {
        this.CertCost = event.target.value;
    }
    CertNameChange(event) {
        this.CertName = event.target.value;
    }

    addNewCertification(event) {
        // console.log(this.CertName);
        // console.log(this.CertCost);
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            addcertification({ CertName: this.CertName, CertCost: this.CertCost }).then(result => {
                if (result == 'Certification Created Successfully') {
                    //alert(result);
                    this.notify('certification Added Successfully', '', 'success');
                    this.closepopup();
                    var payload = {};
                    fireEvent(this.pageRef, 'refreshcertificates', payload);
                    // this.showCert = false; refreshApex(this.valueOfViewCertifications).then(val => { this.showCert = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCert = true; });
                }

                else {
                    //alert(result);
                    this.notify('Failed to add certification', result, 'error');
                }
            });

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