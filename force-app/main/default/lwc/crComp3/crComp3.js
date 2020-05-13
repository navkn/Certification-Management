import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateRequest from '@salesforce/apex/CertificationManagementComponentsHandle.updateRequest';
import updateRequestInitial from '@salesforce/apex/CertificationManagementComponentsHandle.updateRequestInitial';
const listOfOptions = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'Passed', value: 'Passed' },
    { label: 'Failed', value: 'Failed' },
];
var today = new Date().toISOString();
export default class CrComp3 extends LightningElement {
    @track options = listOfOptions;
    @track isEdit = true;

    @wire(CurrentPageReference) pageRef;
    todaysDate;
    yesterdayDate;

    connectedCallback() {
        this.todaysDate = new Date();
        this.yesterdayDate = new Date();
        this.yesterdayDate.setDate(this.todaysDate.getDate() - 1);
        this.todaysDate = this.todaysDate.toISOString();
        this.yesterdayDate = this.yesterdayDate.toISOString();
        registerListener('editrequest', this.handle1, this);

    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

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

    @track request;
    payload;
    @track jsonCert;
    @track jsonEmp;
    handle1(heavyLoad) {
        this.request = heavyLoad.data;
        if (heavyLoad.action == 'view') {
            this.isEdit = false;
            console.log('view');
        }
        else if (heavyLoad.action == 'edit') {
            this.isEdit = true;
            console.log('edit');
        }
        this.initVar();

        //autoscroll to topViewElement
        // var elmnt = document.getElementById("content");
        // alert(elemnt);
        // elmnt.scrollIntoView(true);
        // alert('scrolled');

        var scrollOptions = {
            //left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
       // alert('scrolled');
    }

    initVar() {

        this.crCert = this.request.Certification__r.Name;
        this.crComm = this.request.Comments__c;
        this.crEmp = this.request.Employee__r.Name;
        this.crID = this.request.Name;


        this.crVal = this.request.Due_Date__c;

        this.CertRecordId = this.request.Certification__r.Id;
        this.EmpRecordId = this.request.Employee__r.Id;
        this.jsonCert = { 'Name': this.crCert, 'Id': this.CertRecordId };
        this.jsonEmp = { 'Name': this.crEmp, 'Id': this.EmpRecordId };
        this.recordId = this.request.Id;
        // console.log(this.jsonCert.Name);
        this.crStatus = this.request.Status__c;
        console.log(this.crStatus);
        this.optionsAutoChange();

        if (this.request.Voucher__c != undefined || this.request.Voucher__c != null) { this.crVouCode = this.request.Voucher__r.Name; }

    }
    handleCancel(event) {
        this.isEdit = false;
        this.initVar();

    }
    @track isRequiredComm = false;
    @track dynamicMessage = "";
    optionsAutoChange() {
        if (this.profile == 'App User Profile') {
            this.isStatusNone = false;
            if (this.crStatus == 'Draft') {
                this.options = [{ label: 'Draft', value: 'Draft' }];
            }
            else if (this.crStatus == 'Approved') {
                this.options = [{ label: 'Approved', value: 'Approved' }];
            }
            else if (this.crStatus == 'Rejected') {
                this.options = [{ label: 'Rejected', value: 'Rejected' }];
            }
            else if (this.crStatus == 'Assigned') {
                this.options = [{ label: 'Assigned', value: 'Assigned' },
                { label: 'Passed', value: 'Passed' },
                { label: 'Failed', value: 'Failed' }];
            }
            else if (this.crStatus == 'Passed') {
                this.options = [{ label: 'Passed', value: 'Passed' }];
            }
            else if (this.crStatus == 'Failed') {
                this.options = [{ label: 'Failed', value: 'Failed' }];
            }
            else {
                this.options = [{ label: 'Draft', value: 'Draft' }];
                this.isStatusNone = true;
            }

        }
        else if (this.profile == 'App Admin Profile') {
            if (this.crStatus == 'Draft') {
                this.options = [{ label: 'Approved', value: 'Approved' },
                { label: 'Rejected', value: 'Rejected' }];
            }
            else {
                this.options = [{ label: this.crStatus, value: this.crStatus }];
            }
        }

    }

    handleAutoSelect(event) {
        var nav = event.detail;
        this.crCert = nav.selectedRecordName;
        this.CertRecordId = nav.selectedRecordId;
        console.log('1');
        console.log(this.crCert);
    }

    handleAutoSelect1(event) {
        var nav = event.detail;
        this.crEmp = nav.selectedRecordName;
        this.EmpRecordId = nav.selectedRecordId;
        console.log('2');
        console.log(this.crEmp);
    }

    handleUpdate(event) {
        //console.log(this.vouCost);
        console.log(this.CertRecordId);
        // console.log(this.vouVal);

        if (this.request.Status__c == 'Draft' || this.request.Status__c == 'Approved' || this.request.Status__c == 'Assigned'
            || this.request.Status__c == 'Rejected' || this.request.Status__c == 'Passed' || this.request.Status__c == 'Failed'
        ) {

            const allValid = [...this.template.querySelectorAll('lightning-input')]
                .reduce((validSoFar, inputCmp) => {
                    inputCmp.reportValidity();
                    return validSoFar && inputCmp.checkValidity();
                }, true);
            if (allValid) {
                console.log('All form entries look valid. Ready to submit!');
                updateRequest({ ReqRecordId: this.recordId, status: this.crStatus, comments: this.crComm }).then((result) => {
                    if (result == "Request Updated Successfully") {
                        //refreshApex(this.valueOfViewCertifications);
                        this.notify('Request Updated Successfully', '', 'success');
                        var payload = { type: this.crStatus, oldtype: this.request.Status__c };
                        fireEvent(this.pageRef, 'refreshrequests', payload);
                        this.request = undefined;

                    } else {
                        this.notify('Failed to update request', result, 'error');
                    };
                });
            } else {
                alert('Please update the invalid form entries and try again.');
            }

        }
        else {
            updateRequestInitial({ ReqRecordId: this.recordId, status: this.crStatus, comments: this.crComm, emp: this.EmpRecordId, dueDate: this.crVal, cert: this.CertRecordId }).then((result) => {
                if (result == "Request Updated Successfully") {
                    //refreshApex(this.valueOfViewCertifications);
                    this.notify('Request Updated Successfully', '', 'success');
                    var payload = { type: this.crStatus, oldtype: this.request.Status__c };
                    fireEvent(this.pageRef, 'refreshrequests', payload);
                    this.request = undefined;

                } else {
                    this.notify('Failed to update request', result, 'error');
                };
            });
        }

    }

    handleCancelClicked() {
        this.request = undefined;
    }

    @track crID;
    @track crCert;
    @track crVouCode;
    @track crVal;
    @track crComm;
    @track crStatus;
    @track crEmp;
    @track isStatusNone = false;

    recordId;
    @track CertRecordId;
    @track EmpRecordId;
    todaysDate = today;
    crValChange(event) {
        this.crVal = event.target.value;
        //console.log(this.crVal);
        //console.log(today);
    }

    crStatusChange(event) {
        this.crStatus = event.target.value;
        if (this.crStatus == 'Rejected') {
            this.isRequiredComm = true;
            this.dynamicMessage = "Please enter comments";
        } else {
            this.isRequiredComm = false;
            this.dynamicMessage = "";
        }
        console.log(this.isRequiredComm);
        //console.log(this.crStatus);

    }
    crCommChange(event) {
        this.crComm = event.target.value;
        //console.log(this.crStatus);

    }

    //getting user profile
    @track error = 'hai';
    @track profile;
    @track isEditable = true;
    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            // if (this.profile == 'System Administrator' || this.profile == 'App Admin Profile' ||) {
            //     this.isEditable = true;
            //     console.log(this.isEditable);
            // }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };


}