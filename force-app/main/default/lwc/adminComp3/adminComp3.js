import { LightningElement, wire, track } from 'lwc';
import getApproved from '@salesforce/apex/CertificationManagementComponentsHandle.getApprovedRequests';
import getRejected from '@salesforce/apex/CertificationManagementComponentsHandle.getRejectedRequests';
import getAssigned from '@salesforce/apex/CertificationManagementComponentsHandle.getAssignedRequests';

import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AdminComp3 extends LightningElement {
    @track Requests1;
    @track Requests2;
    @track Requests3;
    @wire(CurrentPageReference) pageRef;


    showApproved = false;
    showRejected = false;
    showAssigned = false;

    valueOfViewApproved;
    firstTime1 = false;
    @wire(getApproved, { flag: '$firstTime1' })
    getApexData1(value) {
        this.showApproved = true;
        this.valueOfViewApproved = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests1 = data;
        }

        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data','Please refresh the page to Load them Correctly','warning');
        }
    }


    valueOfViewRejected;
    firstTime2 = true;
    @wire(getRejected, { flag: '$firstTime2' })
    getApexData2(value) {
        this.valueOfViewRejected = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests2 = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data','Please refresh the page to Load them Correctly','warning');
        }
        this.showRejected = true;
    };

    valueOfViewAssigned;
    firstTime3 = true;
    @wire(getAssigned, { flag: '$firstTime3' })
    getApexData3(value) {
        this.valueOfViewAssigned = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests3 = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data','Please refresh the page to Load them Correctly','warning');
        }
        this.showAssigned = true;
    }


    connectedCallback() {

        registerListener('admincomp2approved', this.handleAdminComp2Approved, this);
        registerListener('admincomp2rejected', this.handleAdminComp2Rejected, this);
        registerListener('admincomp1voucher', this.handleAdminComp1Voucher, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleAdminComp2Approved(payLoad) {
        var message = payLoad.message;
        // refreshApex(this.valueOfViewApproved);
        // refreshApex(this.valueOfViewAssigned);
        this.RefreshApproved();
        this.RefreshAssigned();
    }
    handleAdminComp2Rejected(payLoad) {
        var message = payLoad.message;
        this.RefreshRejected();
        //refreshApex(this.valueOfViewRejected);
    }
    handleAdminComp1Voucher(payLoad) {
        var message = payLoad.message;
        this.RefreshApproved();
        this.RefreshAssigned();
    }

    ApprovedClicked() {
        console.log('clicked');
    }

    RefreshAssigned() {
        this.showAssigned = false;
        refreshApex(this.valueOfViewAssigned).then(val => { this.showAssigned = true; console.log('came'); }).catch(err => { console.log('error came'); this.showAssigned = true; });

    }
    AssignedClicked() {
        //not  clickable
        console.log('clicked');
        if (this.firstTime3 == true) { this.showAssigned = false; this.firstTime3 = false; }
    }
    RefreshApproved() {

        this.showApproved = false;
        refreshApex(this.valueOfViewApproved).then(val => { this.showApproved = true; console.log('came'); }).catch(err => { console.log('error came'); this.showApproved = true; });;
    }
    RejectedClicked(event) {
        console.log('clicked');
        if (this.firstTime2 == true) { this.showRejected = false; this.firstTime2 = false; }

    }
    RefreshRejected() {
        this.showRejected = false;
        refreshApex(this.valueOfViewRejected).then(val => { this.showRejected = true; console.log('came'); }).catch(err => { console.log('error came'); this.showRejected = true; });;
    }

    notify(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

}