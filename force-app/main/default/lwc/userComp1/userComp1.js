import { LightningElement, wire, track } from "lwc";
import addrequest from "@salesforce/apex/CertificationManagementComponentsHandle.addNewReq";
import viewemployees from '@salesforce/apex/CertificationManagementComponentsHandle.getAllEmployees';
import viewcertifications from '@salesforce/apex/CertificationManagementComponentsHandle.getAllCertifications';

import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//const Delay=300;
const columnsofEmp = [{ label: 'Employee Name', fieldName: 'Name' },
{ label: ' Employee Id', fieldName: 'Employee_ID__c', type: 'number' },
{ label: 'Email', fieldName: 'Employee_email__c', type: 'email' },
{ label: 'Company', fieldName: 'Company_Name__c' },
];

const columnsOfCert = [{ label: 'Certification Name', fieldName: 'Name' },
{ label: ' Certification Id', fieldName: 'Certification_ID__c' },
{ label: 'Cost', fieldName: 'Certification_Cost__c', type: 'currency' },
];


//TODO:Add refresh buttons for employeeand cert lists
export default class UserComp1 extends LightningElement {
  @track columnsofEmp = columnsofEmp;
  @track columnsOfCert = columnsOfCert;
  viewempflag;
  viewcertflag;
  valueOfViewEmployees;

  showEmps = false;
  showCert = false;
  firstTime1 = true;//It initializes to true by default
  @wire(viewemployees, { flag: '$firstTime1' })
  getApexData(value) {
    this.valueOfViewEmployees = value;
    const { error, data } = value;
    if (data) {
      console.log(data);
      this.Employees = data;
    }
    if (error) {
      console.log('error has occured');
      this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    }
    this.showEmps = true;
  };

  valueOfViewCertifications;
  firstTime2 = true;//It initializes to true by default
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
      this.notify('Failed To Load data', 'Please refresh the page to Load them Correctly', 'warning');
    }
    this.showCert = true;
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
      //refreshApex(this.valueOfViewCertifications);
    }

  }

  reqflag;

  ReqEmp;
  ReqCert;
  ReqDueDate;
  ReqComm;

  CertRecordId;
  EmpRecordId;

  //@track isHaHa = false;
  @wire(CurrentPageReference) pageRef;

  //
  // viewEmpFlag=false;
  // @track employees;
  // SamEmp;
  // @wire(getEmps,{name:'$SamEmp'}) getApexData(value){

  //   const {data,error} =value;
  //   if(data){this.employees=data;
  //     if(this.employees.length!=0){
  //       console.log('true');     this.viewEmpFlag=true;
  //     }else{
  //       console.log('false'); this.viewEmpFlag=false;
  //     }
  //     console.log('data');}
  //   if(error){console.log('error');}
  // };

  // SamEmpChange(event) {
  //   var searchKey=event.target.value;
  //   this.SamEmp=searchKey;
  //   console.log(this.SamEmp);
  //   //window.clearTimeout(this.delayTimeout);
  //   //this.delayTimeout=setTimeout(()=>{this.SamEmp=searchKey},Delay);

  // };

  // handleSelected(event){
  //   alert('clicked');
  //   alert(event.target.value);
  // }

  //
  ReqDueDateChange(event) {
    this.ReqDueDate = event.target.value;
  }
  ReqCommChange(event) {
    this.ReqComm = event.target.value;
  }
  handleAutoSelect(event) {
    var nav = event.detail;

    this.VouCert = nav.selectedRecordName;
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
    addrequest({
      ReqEmp: this.EmpRecordId,
      ReqCert: this.CertRecordId,
      ReqDueDate: this.ReqDueDate,
      ReqComm: this.ReqComm
    }).then((result) => {
      if (result == "Request Added Successfully") {
        var payLoad = { firstName: "Naveen" };
        fireEvent(this.pageRef, "usercomp1click", payLoad);

        //alert(result);
        this.notify('New Request Added Successfully', '', 'success');
      } else {
        //alert(result);
        this.notify('Failed to Add a New Request', result, 'error');
      };
    });
    this.closepopup();
  }

  closepopup() {
    this.reqflag = false;

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
  // testreqform(event){
  //   getTestData().then(res=>console.log(res)).catch(err=>console.log(err));
  // }
  /* @wire (getdata,{flag:'$isHaHa'})
     getApexData({error,data}){
         if(data){
             console.log(data);
             //this.Requests=data;
             //var req=data[0];
             //console.log(req.Name);
         }
         if(error){
             console.log('error has occured');
         }
     };
     */


}
