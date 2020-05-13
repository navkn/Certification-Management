import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import viewEmployees from '@salesforce/apex/CertificationManagementComponentsHandle.getAllEmployees';
import delEmp from '@salesforce/apex/CertificationManagementComponentsHandle.delEmp';
import id from '@salesforce/user/Id';
import getUserDetails from '@salesforce/apex/CertificationManagementComponentsHandle.getUserDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class EmployeeComp2 extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('refreshemployees', this.handle1, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handle1(payload) {
        console.log('handled');
        if (this.firstTime == true) { this.firstTime = false; }
        else {

            this.showEmployees = false;
            refreshApex(this.valueOfViewEmployees).then(val => { this.showEmployees = true; console.log('came'); }).catch(err => { console.log('error came'); this.showEmployees = true; });
        }
    }

    @track showEmployees = false;
    @track employees;
    valueOfViewEmployees;
    // @track firstTime = false;//It initializes to true by default
    @wire(viewEmployees)
    getApexData1(value) {
        this.valueOfViewEmployees = value;
        console.log(JSON.stringify(value));
        const { error, data } = value;
        if (data) {
            console.log(data);
            this.employees = data;
        }
        if (error) {
            console.log('error has occured');
            this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
        }
        this.showEmployees = true;
    };

    closepopup() {
        this.editEmployee = false;
        this.recordId = undefined;
        
    }
    handleSubmit(event) {
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        console.log(fields);
        console.log(fields.Name);
        //fields.Street = '32 Prince Street';
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSuccess(event) {
        this.closepopup();
        this.notify('Details are updated Successfully','','success');
        this.showEmployees = false;
        refreshApex(this.valueOfViewEmployees).then(val => { this.showEmployees = true; console.log('came'); }).catch(err => { console.log('error came'); this.showEmployees = true; });
    }
    // handleErrors(event){
    //     console.log(JSON.stringify(event));
    //     console.log(JSON.stringify(event.detail));
    //     console.log(event.message);
    //     console.log(JSON.stringify(event.detail.output.fieldErrors));
    //     console.log(event.output);
    // }
    @track editEmployee = false;
    //@track EmpName;
    recordId;
    editForm(event) {
        this.editEmployee = true;
        var emp = this.employees[event.target.value];
        this.recordId = emp.Id;
        //this.EmpName = emp.Name;
        // console.log(this.EmpName);
    }

    // viewForm(event) {
    //     //alert(event.target.value);
    //     console.log(event.target.parentNode.rowIndex);
    //     var ind = event.target.parentNode.rowIndex;
    //     ind = ind - 1;
    //     var payload = { data: this.certifications[ind], action: 'view' };
    //     fireEvent(this.pageRef, 'editcertification', payload);
    //     console.log(payload);
    // }

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
            if (this.profile == 'System Administrator') {
                this.isUpdateAble = true;
            }
        } else if (error) {
            this.error = error;
            console.log(error);
        }
    };

    deleteEmployeeForm(event) {
        var payload = this.employees[event.target.value];
        console.log(event.target.value);
        console.log(payload);
        console.log(payload.Id);
        delEmp({ recId: payload.Id }).then((result) => {
            if (result == "Employee deleted Successfully") {
                this.showEmployees = false;
                refreshApex(this.valueOfViewEmployees).then(val => { this.showEmployees = true; console.log('came'); }).catch(err => { console.log('error came'); this.showEmployees = true; });
                this.notify('Employee deleted Successfully', '', 'success');
            } else {
                this.notify('Failed to delete employee', result, 'error');
            };
        });
    }

}