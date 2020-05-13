import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import viewcertifications from '@salesforce/apex/CertificationManagementComponentsHandle.getAllCertifications';
import delCert from '@salesforce/apex/CertificationManagementComponentsHandle.delCert';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class CertificationsComp2 extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('refreshcertificates', this.handle1, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handle1(payload) {
        console.log('handled');
        if (this.firstTime == true) { this.firstTime = false; }
        else {

            this.showCertifications = false;
            refreshApex(this.valueOfViewCertifications).then(val => { this.showCertifications = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCertifications = true; });
        }
    }

    @track showCertifications = false;
    @track certifications;
    valueOfViewCertifications;
    @track firstTime = false;//It initializes to true by default
    @wire(viewcertifications, { flag: '$firstTime' })
    getApexData1(value) {
        this.valueOfViewCertifications = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.certifications = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showCertifications = true;
    };

    editForm(event) {
        //alert(event.target.value);
        var payload = { data: this.certifications[event.target.value], action: 'edit' };
        fireEvent(this.pageRef, 'editcertification', payload);
        console.log(payload);
    }

    viewForm(event) {
        //alert(event.target.value);
        console.log(event.target.parentNode.rowIndex);
        var ind = event.target.parentNode.rowIndex;
        ind = ind - 1;
        var payload = { data: this.certifications[ind], action: 'view' };
        fireEvent(this.pageRef, 'editcertification', payload);
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
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };

    deleteCertificateForm(event) {
        var payload = this.certifications[event.target.value];
        console.log(event.target.value);
        console.log(payload);
        console.log(payload.Id);
        delCert({ recId: payload.Id }).then((result) => {
            if (result == "Certification deleted Successfully") {
                
                this.showCertifications = false;
                refreshApex(this.valueOfViewCertifications).then(val => { this.showCertifications = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCertifications = true; });
                this.notify('Certification deleted Successfully', '', 'success');
            } else {
                this.notify('Failed to delete certificate', result, 'error');
            };
        });
    }

}