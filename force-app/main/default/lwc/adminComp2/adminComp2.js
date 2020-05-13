import { LightningElement, wire, track } from 'lwc';
import getdata from '@salesforce/apex/CertificationManagementComponentsHandle.getDraftRequests';
import updateRequest from '@salesforce/apex/CertificationManagementComponentsHandle.updateRequest';

import { refreshApex } from '@salesforce/apex';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AdminComp2 extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    @track Requests;
    @track comment;
    selectedRejection = false;

    showDrafts = false;
    valueOfViewRequests;
    @wire(getdata)
    getApexData(value) {
        this.valueOfViewRequests = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Requests = data;
            //this.notify('Success', 'Message', 'success');

        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load Component', 'Please refresh the page to Load them Correctly', 'warning');
        }

        this.showDrafts = true;
    }

    saveComment(event) {
        this.comment = event.target.value;
    }

    flagged = false;
    ind;

    approvereq(event) {
        this.selectedRejection = false;
        this.ind = event.target.value;
        this.flagged = true;
        this.ReqRecordId = this.Requests[this.ind].Id;
    }
    rejectreq(event) {
        this.ind = event.target.value;
        this.selectedRejection = true;
        this.flagged = true;
        this.ReqRecordId = this.Requests[this.ind].Id;
    }

    refreshDrafts() {
        this.showDrafts = false;
        refreshApex(this.valueOfViewRequests).then(val => { this.showDrafts = true; console.log('came'); }).catch(err => { console.log('error came'); this.showDrafts = true; });
    }

    AddComment() {
        if (this.selectedRejection == true) {
            if (this.comment != null && this.comment != '') {
                updateRequest({ ReqRecordId: this.ReqRecordId, status: 'Rejected', comments: this.comment })
                    .then(result => {
                        if (result == 'Request Updated Successfully') {
                            //alert(result);
                            this.notify('Request Rejected Successfully', '', 'success');
                            var payload = 'Rejected';
                            fireEvent(this.pageRef, 'admincomp2rejected', payload);
                            this.refreshDrafts();
                        }
                        else {
                            // alert(result);
                            this.notify('Failed To reject the request', result, 'error');
                        }
                        this.selectedRejection = false;
                        this.closepopup();
                    });
                this.closepopup();
            }
            else {
                this.selectedRejection = true;
                this.comment = '';
                // alert('Please Enter Comments');
                this.notify('Please Enter Comments', '', 'warning');
            }
        }
        else {
            updateRequest({ ReqRecordId: this.ReqRecordId, status: 'Approved', comments: this.comment }).
                then(result => {
                    if (result == 'Request Updated Successfully') {
                        // alert(result);
                        this.notify('Request Approved Successfully', '', 'success');
                        var payload = 'Approved';
                        fireEvent(this.pageRef, 'admincomp2approved', payload);
                        this.refreshDrafts();
                        this.closepopup();
                    }
                    else {
                        // alert(result);
                        this.notify('Failed To Approve the Request', result, 'error');
                    }
                    this.closepopup();
                });
            this.closepopup();
        }
        this.comment = null;

    }

    closepopup() {
        this.flagged = false;
        this.selectedRejection = false;
        this.comment = null;
    }
    notify(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }


    //tried with platform events
    // connectedCallback() {
    //     this.handleSubscribe();
    //     //setDebugFlag=true;
    //     //console.log(isEmpEnabled);
    //     isEmpEnabled().then(r=>{console.log(r);}).catch(err=>console.log('error'));
    // }
    // disconnectedCallback(){
    //     this.handleUnsubscribe();
    // }

    // subscription = {};
    // @track channelName = '/event/sample1__e';
    // handleSubscribe() {
    //     // Callback invoked whenever a new event message is received
    //     const messageCallback = function (response) {
    //         console.log(this.subscription);
    //         alert('resp came');
    //         console.log(response);
    //         console.log('New message received : ', JSON.stringify(response));
    //         // Response contains the payload of the new message received
    //     };

    //     // Invoke subscribe method of empApi. Pass reference to messageCallback
    //     subscribe(this.channelName, -1, messageCallback).then(response => {
    //         // Response contains the subscription information on successful subscribe call
    //         console.log('Successfully subscribed to : ', JSON.stringify(response.channel));
    //         this.subscription = response;
    //        // this.toggleSubscribeButton(true);
    //         console.log(this.subscription);
    //         alert('data came');
    //     });
    // }

    // handleUnsubscribe() {
    //   //  this.toggleSubscribeButton(false);

    //     // Invoke unsubscribe method of empApi
    //     unsubscribe(this.subscription, response => {
    //         console.log('unsubscribe() response: ', JSON.stringify(response));
    //         // Response is true for successful unsubscribe
    //     });
    // }

    // registerErrorListener() {
    //     // Invoke onError empApi method
    //     onError(error => {
    //         console.log('Received error from server: ', JSON.stringify(error));
    //         // Error contains the server-side error
    //     });
    // }

}