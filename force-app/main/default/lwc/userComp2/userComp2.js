import { LightningElement, wire, track } from 'lwc';
import getdata from '@salesforce/apex/CertificationManagementComponentsHandle.getNoneRequests';
import updateRequest from '@salesforce/apex/CertificationManagementComponentsHandle.updateRequest';

import { refreshApex } from '@salesforce/apex';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UserComp2 extends LightningElement {

    @track Requests;

    @wire(CurrentPageReference) pageRef;

    valueOfNoneRequests;
    showNoneReq = false;
    //firstTime=true;//It initializes to true by default
    @wire(getdata)
    getApexData(value) {
        const { error, data } = value;
        this.valueOfNoneRequests = value;
        if (data) {
            this.Requests = data;
            console.log(data);
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showNoneReq = true;
        //this.callItOnceMore = !this.callItOnceMore;
    };




    ind;
    connectedCallback() {
        registerListener('usercomp1click', this.handleRegusercomp1click, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
        //unregisterListener('usercomp1click',this.handleDeregusercomp1click,this);
    }

    handleRegusercomp1click(dataFromComp) {
        this.showNoneReq = false;
        this.RecallWiredData();
    }

    submitreq(event) {
        // alert('button working');
        this.ind = event.target.value;
        //alert('index : '+this.ind);
        this.ReqRecordId = this.Requests[this.ind].Id;
        // alert('Record Id : '+this.ReqRecordId);
        updateRequest({ ReqRecordId: this.ReqRecordId, status: 'Draft' }).then(result => {
            if (result == 'Request Updated Successfully') {
                //alert(result);
                //window.location.reload();
                this.notify('Request submitted Successfully', '', 'success');
                this.RecallWiredData();
            }
            else {//alert(result);
                this.notify('Request Failed to submit', result, 'error');
            };
        });
    }

    RecallWiredData() {
        // this.firstTime = false;
        // setTimeout(function () { this.callItOnceMore = !this.callItOnceMore; }, 10000);
        refreshApex(this.valueOfNoneRequests).then(val => { this.showNoneReq = true; console.log('came'); }).catch(err => { console.log('error came'); this.showNoneReq = true; });;
        //wire's getdata gets reexecuted only when its params are changed with new values
        //refreshapex doesn't care whether getdata's arguments are changed or not 
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