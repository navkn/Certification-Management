import { LightningElement, wire, track } from 'lwc';
import getdata1 from '@salesforce/apex/CertificationManagementComponentsHandle.getAssignedRequests';
import getdata2 from '@salesforce/apex/CertificationManagementComponentsHandle.getPassedRequests';
import getdata3 from '@salesforce/apex/CertificationManagementComponentsHandle.getFailedRequests';
import updateRequest from '@salesforce/apex/CertificationManagementComponentsHandle.updateRequest';

import { refreshApex } from '@salesforce/apex';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserComp3 extends LightningElement {
    @track Requests1;
    @track Requests2;
    @track Requests3;

    showAssigned = false;
    showPassed = false;
    showFailed = false;

    valueOFGetApexData1;
    firstTime1 = false;
    @wire(getdata1, { flag: '$firstTime1' })
    getApexData1(value) {
        this.showAssigned = true;
        this.valueOFGetApexData1 = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests1 = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }

    }

    valueOFGetApexData2;
    firstTime2 = true;//It initializes to true by default
    @wire(getdata2, { flag: '$firstTime2' })
    getApexData2(value) {
        this.valueOFGetApexData2 = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests2 = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showPassed = true;
    }

    valueOFGetApexData3;
    firstTime3 = true;//It initializes to true by default
    @wire(getdata3, { flag: '$firstTime3' })
    getApexData3(value) {
        this.valueOFGetApexData3 = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests3 = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showFailed = true;
    }

    ind;
    passedreq(event) {
        this.ind = event.target.value;
        this.ReqRecordId = this.Requests1[this.ind].Id;
        updateRequest({ ReqRecordId: this.ReqRecordId, status: 'Passed' }).then(result => {
            if (result == 'Request Updated Successfully') {
                //alert(result); 
                this.notify('Status change to PASS is Successful', '', 'success');
                this.RefreshPassed(); this.RefreshAssigned();
            } else {
                //alert(result);
                this.notify('Failed To update the status', result, 'error');
            }
        });
    }
    failedreq(event) {
        this.ind = event.target.value;
        this.ReqRecordId = this.Requests1[this.ind].Id;
        updateRequest({ ReqRecordId: this.ReqRecordId, status: 'Failed' }).then(result => {
            if (result == 'Request Updated Successfully') {
                //alert(result); 
                this.notify('Status change to FAIL is Successful', '', 'success');
                this.RefreshFailed(); this.RefreshAssigned();
            } else {//alert(result);
                this.notify('Failed To update the status', result, 'error');
            }
        });
    }

    AssignedClicked() {
        // console.log('clicked');

    }
    RefreshAssigned() {

        this.showAssigned = false;
        refreshApex(this.valueOFGetApexData1).then(val => { this.showAssigned = true; console.log('came'); }).catch(err => { console.log('error came'); this.showAssigned = true; });
        // alert('gng to call');
        // getdata1().then(value => {
        //     alert('data has got');
        //     this.showAssigned = true;
        //     //const { error, data } = value;
        //     console.log(value);
        //     alert('value');
        //     this.Requests1 = value;
        //     alert('1');
        // }).catch(err=>{console.log('err');});
        // alert('called success');

    }
    PassedClicked() {
        //not  clickable
        // console.log('clicked');
        if (this.firstTime2 == true) { this.showPassed = false; this.firstTime2 = false; }

    }
    RefreshPassed() {

        this.showPassed = false;
        refreshApex(this.valueOFGetApexData2).then(val => { this.showPassed = true; console.log('came'); }).catch(err => { console.log('error came'); this.showPassed = true; });;
    }
    FailedClicked(event) {
        //console.log('clicked');
        if (this.firstTime3 == true) { this.showFailed = false; this.firstTime3 = false; }

    }
    RefreshFailed() {
        this.showFailed = false;
        refreshApex(this.valueOFGetApexData3).then(val => { this.showFailed = true; console.log('came'); }).catch(err => { console.log('error came'); this.showFailed = true; });;
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