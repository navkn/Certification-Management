import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updCert from '@salesforce/apex/CertificationManagementComponentsHandle.updCert';

export default class CertificationsComp3 extends LightningElement {

    @track isEdit = true;

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('editcertification', this.handle1, this);
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
    @track certificate;
    handle1(heavyLoad) {
        var payload = heavyLoad.data;
        this.certificate = payload;
        this.certName = this.certificate.Name;
        this.certID = this.certificate.Certification_ID__c;
        this.certCost = this.certificate.Certification_Cost__c;
        this.recordId = this.certificate.Id;
        if (heavyLoad.action == 'view') {
            this.isEdit = false;
        }
        if (heavyLoad.action == 'edit') {
            this.isEdit = true;
        }
    }

    handleCancel(event) {
        this.isEdit = false;
    }
    handleUpdate(event) {
        console.log(this.certCost);
        console.log(this.recordId);
        updCert({ recId: this.recordId, certCost: this.certCost }).then((result) => {
            if (result == "Certification updated Successfully") {
                //refreshApex(this.valueOfViewCertifications);
                var payload = {};
                fireEvent(this.pageRef, 'refreshcertificates', payload);
                this.handleCancel(payload);
                this.notify('Certification updated Successfully', '', 'success');
            } else {
                this.notify('Failed to update certificate', result, 'error');
            };
        });
    }
    @track certName;
    @track certID;
    @track certCost;
    recordId;

    CertCostChange(event) {
        this.certCost = event.target.value;
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
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };


}