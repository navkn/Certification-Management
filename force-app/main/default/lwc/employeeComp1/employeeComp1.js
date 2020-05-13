import { LightningElement, wire,track} from 'lwc';
import getdata from '@salesforce/apex/CertificationManagementComponentsHandle.getNoneRequests';

export default class EmployeeComp1 extends LightningElement {
    @track employees;

    @wire(getdata)
    getApexData(value) {
        const { error, data } = value;
        //this.valueOfNoneRequests = value;
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
}