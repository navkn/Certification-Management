import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import getAllRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getAllRequestsNC';
import delRequest from '@salesforce/apex/CertificationManagementComponentsHandle.delRequest';
//import getFilteredRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getFilteredRequests';
import getNoneRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getNoneRequestsNC';
import getAssignedRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getAssignedRequestsNC';
import getApprovedRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getApprovedRequestsNC';
import getRejectedRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getRejectedRequestsNC';
import getPassedRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getPassedRequestsNC';
import getFailedRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getFailedRequestsNC';
import getDraftRequests from '@salesforce/apex/CertificationManagementComponentsHandle.getDraftRequestsNC';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class CrComp2 extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('refreshrequests', this.handle1, this);
        getAllRequests().then(val => {
            console.log(val);
            this.requests = val;
            this.showCR = true;
        }).catch(err => console.log(err));
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handle1(payload) {
        console.log('handled');
        console.log(payload);
        console.log(this.storedStatus);
        if (payload.oldtype != undefined) {
            //i.e.from 3rd comp
            //now check whether the current comp is displaying is same as oldtype then just refresh that
            if (this.storedStatus == 'All') {
                this.switchStatusData('All');
            }
            else if (payload.oldtype == this.storedStatus) {
                this.switchStatusData(payload.oldtype);
            }
            else if (payload.type == this.storedStatus) {
                this.switchStatusData(payload.type);
                this.storedStatus = payload.type;

            }

        }
        else {
            //if it is from 1st comp just refresh also update current storedstatus
            this.switchStatusData(payload.type);
            this.storedStatus = payload.type;
        }

    }

    storedStatus = 'All';

    switchStatusData(st) {
        console.log(st);
        // var fun;
        // if (st == '') { fun = this.valueOfViewRequestsNone; }
        // else if (st == 'Draft') { fun = this.valueOfViewRequestsDraft }
        // else if (st == 'Approved') { fun = this.valueOfViewRequestsApproved }
        // else if (st == 'Assigned') { fun = this.valueOfViewRequestsAssigned }
        // else if (st == 'Rejected') { fun = this.valueOfViewRequestsRejected }
        // else if (st == 'Passed') { fun = this.valueOfViewRequestsPassed }
        // else if (st == 'Failed') { fun = this.valueOfViewRequestsFailed }
        // else if (st == 'All') { fun = this.valueOfViewRequests }

        // this.showCR = false;
        // this.requests = fun.data;
        // console.log('old fun');
        // console.log(fun);
        // refreshApex(fun).then(val => {

        //     this.showCR = true;

        // }).catch(err => { console.log('error came'); this.showCR = true; });


        if (st == '') {
            this.showCR = false;
            //refreshApex(this.valueOfViewRequestsNone).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            getNoneRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));

        }
        else if (st == 'Draft') {
            this.showCR = false;
            //refreshApex(this.valueOfViewRequestsDraft).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            getDraftRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'Approved') {

            this.showCR = false;
            // refreshApex(this.valueOfViewRequestsApproved).then(val => { this.showCR = true;this.requests=this.valueOfViewRequestsApproved.data; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            // console.log('appr data');
            // console.log(this.valueOfViewRequestsApproved);

            getApprovedRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'Assigned') {
            this.showCR = false;
            //refreshApex(this.valueOfViewRequestsAssigned).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            getAssignedRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'Rejected') {

            this.showCR = false;
            // refreshApex(this.valueOfViewRequestsRejected).then(val => { this.showCR = true; this.requests=this.valueOfViewRequestsRejected.data; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            // console.log('rej data');
            // console.log(this.valueOfViewRequestsRejected);
            getRejectedRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'Passed') {
            this.showCR = false;
            // refreshApex(this.valueOfViewRequestsPassed).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            getPassedRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'Failed') {
            this.showCR = false;
            // refreshApex(this.valueOfViewRequestsFailed).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            getFailedRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }
        else if (st == 'All') {
            this.showCR = false;
            // refreshApex(this.valueOfViewRequests).then(val => { this.showCR = true; this.requests=this.valueOfViewRequests.data;console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });
            // console.log('all data');
            // console.log(this.valueOfViewRequests);
            getAllRequests().then(val => {
                console.log(val);
                this.requests = val;
                this.showCR = true;
            }).catch(err => console.log(err));
        }

    }

    @track showCR = false;
    @track requests;


    editRequest(event) {
        //alert(event.target.value);
        var payload = { data: this.requests[event.target.value], action: 'edit' };
        fireEvent(this.pageRef, 'editrequest', payload);
        console.log(payload);
    }

    viewForm(event) {
        // alert(event.target.value);
        // console.log(event.target.parentNode.rowIndex);
        var ind = event.target.parentNode.rowIndex;
        ind = ind - 1;
        var payload = { data: this.requests[ind], action: 'view' };
        fireEvent(this.pageRef, 'editrequest', payload);
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
    @track profile;
    @track isDeleteAble = false;


    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'System Administrator') {
                this.isDeleteAble = true;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };

    deleteRequest(event) {
        var payload = this.requests[event.target.value];
        //console.log(event.target.value);
        //console.log(payload);
        console.log(payload.Id);
        delRequest({ recId: payload.Id }).then((result) => {
            if (result == "Request deleted Successfully") {
                //refreshApex(this.valueOfViewRequests);
                //this.showCR = false;
                // refreshApex(this.valueOfViewRequests).then(val => { this.showCR = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCR = true; });

                // getAllRequests().then(val => {
                //     console.log(val);
                //     this.requests = val;
                //     this.showCR = true;
                // }).catch(err => console.log(err));
                this.switchStatusData(this.storedStatus);
                this.notify('Request deleted Successfully', '', 'success');
            } else {
                this.notify('Failed to delete Request', result, 'error');
            };
        });
    }

    // valueOfViewRequests;
    // firstTime = true;//It initializes to true by default
    // @wire(getAllRequests)
    // getApexData1(value) {
    //     this.valueOfViewRequests = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //         if (this.firstTime == true) {
    //             this.firstTime = false;
    //         }

    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    //     console.log('all data inside wired all reqs');
    //     console.log(this.valueOfViewRequests);
    // };

    // valueOfViewRequestsNone;
    // //@track firstTime = false;//It initializes to true by default
    // @wire(getNoneRequests, { flag: '$firstTime' })
    // getApexData2(value) {
    //     this.valueOfViewRequestsNone = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    //     console.log('none data inside wired');
    //     console.log(this.valueOfViewRequestsRejected);
    // };

    // @track valueOfViewRequestsDraft;
    // //@track firstTime = false;//It initializes to true by default
    // @wire(getDraftRequests, { flag: '$firstTime' })
    // getApexData3(value) {
    //     this.valueOfViewRequestsDraft = value;
    //     const { error, data } = value;
    //     if (data) {
    //         console.log(value);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     this.showCert = true;

    //     // console.log('draft data inside wired');
    //     // console.log(this.valueOfViewRequestsDraft);
    //     // //console.log(value);
    //     // this.requests = value.data;
    // };


    // valueOfViewRequestsApproved;
    // // @track firstTime = false;//It initializes to true by default
    // @wire(getApprovedRequests, { flag: '$firstTime' })
    // getApexData4(value) {
    //     this.valueOfViewRequestsApproved = value;
    //     const { error, data } = value;
    //     if (data) {
    //         console.log(value);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     // this.showCR = true;
    //     // console.log('appr data inside wired');
    //     // console.log(this.valueOfViewRequestsApproved);
    //     // // console.log(value);
    //     // this.requests = value.data;
    // };


    // valueOfViewRequestsAssigned;
    // //@track firstTime = false;//It initializes to true by default
    // @wire(getAssignedRequests, { flag: '$firstTime' })
    // getApexData5(value) {
    //     this.valueOfViewRequestsAssigned = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    //     console.log('assi data inside wired');
    //     console.log(this.valueOfViewRequestsRejected);
    // };


    // valueOfViewRequestsRejected;
    // // @track firstTime = false;//It initializes to true by default
    // @wire(getRejectedRequests, { flag: '$firstTime' })
    // getApexData6(value) {
    //     this.valueOfViewRequestsRejected = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    //     console.log('rej data inside wired');
    //     console.log(this.valueOfViewRequestsRejected);
    // };


    // valueOfViewRequestsPassed;
    // // @track firstTime = false;//It initializes to true by default
    // @wire(getPassedRequests, { flag: '$firstTime' })
    // getApexData7(value) {
    //     this.valueOfViewRequestsPassed = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    //     console.log('passed data inside wired');
    //     console.log(this.valueOfViewRequestsRejected);
    // };


    // valueOfViewRequestsFailed;
    // //@track firstTime = false;//It initializes to true by default
    // @wire(getFailedRequests, { flag: '$firstTime' })
    // getApexData8(value) {
    //     this.valueOfViewRequestsFailed = value;
    //     const { error, data } = value;
    //     if (data) {
    //         //console.log(data);
    //         this.requests = data;
    //     }
    //     if (error) {
    //         console.log('error has occured');
    //         this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    //     }
    //     //this.showCert = true;
    //     this.showCR = true;
    // };

}