import { LightningElement, wire, track } from 'lwc';

import addrequest from '@salesforce/apex/CertificationManagementComponentsHandle.addNewReq';
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const options = [
    { label: 'All', value: 'All' },
    { label: 'None', value: '' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'Passed', value: 'Passed' },
    { label: 'Failed', value: 'Failed' },
];

export default class CrComp1 extends LightningElement {

    @track reqflag = false;
    options = options;
    ReqEmp;
    ReqCert;
    ReqDueDate;

    CertRecordId;
    EmpRecordId;

    todaysDate;
    yesterdayDate;

    connectedCallback() {
        this.todaysDate = new Date();
        this.yesterdayDate = new Date();
        this.yesterdayDate.setDate(this.todaysDate.getDate() - 1);
        this.todaysDate = this.todaysDate.toISOString();
        this.yesterdayDate = this.yesterdayDate.toISOString();

    }

    ReqDueDateChange(event) {
        this.ReqDueDate = event.target.value;

        //console.log(this.ReqDueDate >= today);
    }
    ReqCommChange(event) {
        this.ReqComm = event.target.value;
    }
    handleAutoSelect(event) {
        var nav = event.detail;
        this.ReqCert = nav.selectedRecordName;
        this.CertRecordId = nav.selectedRecordId;
    }
    handleAutoSelect1(event) {
        var emp = event.detail;
        this.ReqEmp = emp.selectedRecordName;
        this.EmpRecordId = emp.selectedRecordId;
    }
    reqform() {
        this.reqflag = true;
    }
    addreq() {
        //var newReq={ ReqEmp: this.EmpRecordId, ReqCert: this.CertRecordId, ReqDueDate: this.ReqDueDate, ReqComm: this.ReqComm,ReqStatus:'' };

        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            if (this.CertRecordId != undefined || this.CertRecordId != null) {
                if (this.EmpRecordId != undefined || this.EmpRecordId != null) {
                    addrequest({
                        ReqEmp: this.EmpRecordId,
                        ReqCert: this.CertRecordId,
                        ReqDueDate: this.ReqDueDate
                    }).then((result) => {
                        if (result == "Request Added Successfully") {
                            var payLoad = { type: 'All' };
                            fireEvent(this.pageRef, "refreshrequests", payLoad);

                            this.closepopup();
                            this.notify('New Request Added Successfully', '', 'success');
                        } else {
                            //alert(result);
                            this.notify('Failed to Add a New Request', result, 'error');
                        };
                    });
                }
                else {
                    //alert('Please select an Employee');
                    this.notify('Please select an Employee', '', 'error');
                }
            }
            else {
                //alert('Please select a certification');
                this.notify('Please select a certification', '', 'error');
            }
        }
        else {
            alert('Please review all errors');
        }

    }



    @wire(CurrentPageReference) pageRef;


    closepopup() {
        this.reqflag = false;
        this.ReqEmp = undefined;
        this.ReqCert = undefined;
        this.ReqDueDate = undefined;
        this.CertRecordId = undefined;
        this.EmpRecordId = undefined;
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
    @track isAddAble = true;

    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'App Admin Profile') {
                this.isAddAble = false;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };

    handleStatusOptions(event) {
        console.log(event.target);
        console.log(event.detail);
        console.log(event.detail.value);
        var statusType = event.detail.value;
        var payLoad = { type: statusType };
        fireEvent(this.pageRef, "refreshrequests", payLoad);

    }
}