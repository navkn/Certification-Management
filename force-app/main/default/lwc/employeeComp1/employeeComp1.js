import { LightningElement, wire, track } from 'lwc';

import addEmployee from '@salesforce/apex/CertificationManagementComponentsHandle.addNewEmp';
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class EmployeeComp1 extends LightningElement {

    @wire(CurrentPageReference) pageRef;

    @track empflag = false;

    closepopup() {
        this.empflag = false;
        this.EmpComm = undefined;
        this.EmpExp = undefined;
        this.EmpSS = undefined;
        this.EmpPS = undefined;
        this.EmpMail = undefined;
        this.EmpId = undefined;
        this.EmpName = undefined;
        //this.isAddAble=false;
    }

    EmpComm; EmpExp; EmpSS; EmpPS; EmpMail; EmpId; EmpName; EmpCompany;

    EmpCommChange(event) {
        this.EmpComm = event.target.value;
    }

    EmpExpChange(event) {
        this.EmpExp = event.target.value;
    }
    EmpSSChange(event) {
        this.EmpSS = event.target.value;
    }
    EmpPSChange(event) {
        this.EmpPS = event.target.value;
    }
    EmpMailChange(event) {
        this.EmpMail = event.target.value;
    }
    EmpIdChange(event) {
        this.EmpId = event.target.value;
    }
    EmpNameChange(event) {
        this.EmpName = event.target.value;
    }
    EmpCompanyChange(event) {
        this.EmpCompany = event.target.value;
    }



    addEmp(event) {
        this.empflag = true;
    }

    addNewEmployee(event) {
        // console.log(this.CertName);
        // console.log(this.CertCost);
        //console.log(this.EmpName + this.EmpComm + this.EmpId + this.EmpPS + this.EmpSS + this.EmpMail + this.EmpExp);
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {

            addEmployee({
                EmpName: this.EmpName, EmpId: this.EmpId,
                EmpMail: this.EmpMail, EmpPS: this.EmpPS,
                EmpSS: this.EmpSS, EmpExp: this.EmpExp,
                EmpComm: this.EmpComm, EmpComp: this.EmpCompany
            }).then(result => {
                if (result == 'Employee Created Successfully') {
                    this.notify('Employee Added Successfully', '', 'success');
                    this.closepopup();
                    var payload = {};
                    fireEvent(this.pageRef, 'refreshemployees', payload);

                }

                else {
                    this.notify('Failed to add employee', result, 'error');
                }


            });
        }
        else {
            alert('Please review errors');
        }
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
    @track error = 'error';
    @track profile;
    @track isAddAble = false;

    userId = id;
    @wire(getUserDetails, { recId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            //console.log('1');
            console.log(data.Name);
            this.profile = data.Name;
            if (this.profile == 'System Administrator') {
                this.isAddAble = true;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };
}