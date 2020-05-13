import { LightningElement, wire, track } from 'lwc';
import addcertification from '@salesforce/apex/CertificationManagementComponentsHandle.addNewCert';
import addvoucher from '@salesforce/apex/CertificationManagementComponentsHandle.addNewVou';
import viewcertifications from '@salesforce/apex/CertificationManagementComponentsHandle.getAllCertifications';
import viewvouchers from '@salesforce/apex/CertificationManagementComponentsHandle.getAllVouchers';

import { refreshApex } from '@salesforce/apex';

import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const columnsofEmp = [{ label: 'Employee Name', fieldName: 'Name' },
{ label: ' Employee Id', fieldName: 'Employee_ID__c', type: 'number' },
{ label: 'Email', fieldName: 'Employee_email__c', type: 'email' },
{ label: 'Company', fieldName: 'Company_Name__c' },
];

const columnsOfCert = [{ label: 'Certification Name', fieldName: 'Name' },
{ label: ' Certification Id', fieldName: 'Certification_ID__c' },
{ label: 'Cost', fieldName: 'Certification_Cost__c', type: 'currency' },
];

const columnsOfVou = [{ label: 'Voucher Code', fieldName: 'Name' },
{ label: 'Certification', fieldName: 'Certification__c' },
{ label: 'Active', fieldName: 'Active__c', type: 'boolean' },
{ label: 'Validity', fieldName: 'Validity__c', type: 'date' },
{ label: 'Cost', fieldName: 'Voucher_Cost__c', type: 'currency' },
];

export default class AdminComp1 extends LightningElement {
    @track columnsofEmp = columnsofEmp;
    @track columnsOfCert = columnsOfCert;
    @track columnsOfVou = columnsOfVou;

    @wire(CurrentPageReference) pageRef;


    CertName;
    CertCost;


    VouCost;
    VouValid;
    VouCert;

    @track CertRecordId;

    certflag;
    vouflag;

    viewempflag;
    viewcertflag;
    viewvouflag;

    showEmps = false;
    showCert = false; showVou = false;

    @track Employees;
    @track Certifications;
    @track Vouchers;

    valueOfViewEmployees;
    firstTime1 = true;

    valueOfViewCertifications;
    firstTime2 = true;
    @wire(viewcertifications, { flag: '$firstTime2' })
    getApexData1(value) {
        this.valueOfViewCertifications = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Certifications = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load Correctly', 'warning');
        }
        this.showCert = true;
    };
    deleteThis(event) {
        console.log(event.target.value);
    }
    valueOfViewVouchers;
    firstTime3 = true;//It initializes to true by default
    @wire(viewvouchers, { flag: '$firstTime3' })
    getApexData2(value) {
        this.valueOfViewVouchers = value;
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.Vouchers = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showVou = true;
    };

    viewemps() {
        this.viewempflag = true;
        if (this.firstTime1 == true) {
            this.firstTime1 = false;
            this.showEmps = false;
        }
        else {
            this.showEmps = true;
        }
    }

    viewcerts() {
        this.viewcertflag = true;
        if (this.firstTime2 == true) {
            this.firstTime2 = false;
            this.showCert = false;
        }
        else {
            this.showCert = true;
        }
    }

    viewvous() {
        this.viewvouflag = true;
        if (this.firstTime3 == true) {
            this.firstTime3 = false;
            this.showVou = false;
        }
        else {
            this.showVou = true;
        }
    }




    CertNameChange(event) {
        this.CertName = event.target.value;
    }
    CertCostChange(event) {
        this.CertCost = event.target.value;
    }


    VouCostChange(event) {
        this.VouCost = event.target.value;
    }
    VouValidChange(event) {
        this.VouValid = event.target.value;
        
    }

    handleAutoSelect(event) {
        var nav = event.detail;
        this.VouCert = nav.selectedRecordName;
        this.CertRecordId = nav.selectedRecordId;
    }

    certform() {
        this.certflag = true;
    }

    vouform() {
        this.vouflag = true;
    }

    addcert() {
        console.log(this.CertName);
        console.log(this.CertCost);
        addcertification({ CertName: this.CertName, CertCost: this.CertCost }).then(result => {
            if (result == 'Certification Created Successfully') {
                //alert(result);
                this.notify('certification Added Successfully', '', 'success');
                this.closepopup(); this.showCert = false; refreshApex(this.valueOfViewCertifications).then(val => { this.showCert = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCert = true; });
            }
            else {
                //alert(result);
                this.notify('Failed to add certification', result, 'error');
            }
        });
        this.certflag = false;
    }

    addvou() {
        
        addvoucher({ VouCost: this.VouCost, VouValid: this.VouValid, VouCert: this.CertRecordId })
            .then(result => {
                if (result == 'Voucher Added Successfully') {
                    var payLoad = { firstName: "Naveen" };
                    fireEvent(this.pageRef, "admincomp1voucher", payLoad);
                    //alert(result);
                    this.notify('Voucher Added Successfully', '', 'success');
                    this.closepopup();
                    this.showVou = false;
                    refreshApex(this.valueOfViewVouchers).then(val => { this.showVou = true; console.log('came'); }).catch(err => { console.log('error came'); this.showCert = true; });
                } else {
                    //alert(result);
                    this.notify('Failed to add Voucher', result, 'error');
                };
            });
        this.vouflag = false;
    }

    closepopup() {
        this.certflag = false;
        this.vouflag = false;
        this.viewvouflag = false;
        this.viewempflag = false;
        this.viewcertflag = false;

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