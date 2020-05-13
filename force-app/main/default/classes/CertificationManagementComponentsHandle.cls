public with sharing class CertificationManagementComponentsHandle {
    public CertificationManagementComponentsHandle() {

    }
    @AuraEnabled
    public static List<Certification_Request__c> getAllRequestsNC(Boolean flag){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
            reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c ORDER BY Name DESC NULLS FIRST] ; 
       // if(flag!=true)
        return reqs;
    }
    //Code for getting request records depending on status
    
    @AuraEnabled
    public static List<Certification_Request__c> getNoneRequestsNC(Boolean flag ){
        //flag is initialized as true by default
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled
    public static List<Certification_Request__c> getDraftRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Draft' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
        
    }
    
    @AuraEnabled
    public static List<Certification_Request__c> getAssignedRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
       // if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Assigned' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }
    
    @AuraEnabled
    public static List<Certification_Request__c> getApprovedRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Approved' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }
  
    @AuraEnabled
    public static List<Certification_Request__c> getRejectedRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Rejected' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled
    public static List<Certification_Request__c> getPassedRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Passed' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled
    public static List<Certification_Request__c> getFailedRequestsNC(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Failed' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getAllRequests(Boolean flag){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
            reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c ORDER BY Name DESC NULLS FIRST] ; 
       // if(flag!=true)
        return reqs;
    }
    //Code for getting request records depending on status
    
    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getNoneRequests(Boolean flag ){
        //flag is initialized as true by default
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getDraftRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Draft' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
        
    }
    
    
    
    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getAssignedRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
       // if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Assigned' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getApprovedRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Approved' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }
  
    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getRejectedRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Rejected' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getPassedRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Passed' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getFailedRequests(Boolean flag ){
        List<Certification_Request__c> reqs=new List<Certification_Request__c>();
        if(flag!=true)
        reqs = [SELECT Certification__r.Name,Comments__c,Due_Date__c,Email__c,Employee__r.Name,Id,Name,Status__c,Voucher__r.Name FROM Certification_Request__c WHERE Status__c='Failed' ORDER BY Name DESC NULLS FIRST] ;
        return reqs;
    }


    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getAllEmployees(Boolean flag ){
        List<Employee__c> emps=new List<Employee__c>();
        if(flag!=true)
        emps = [SELECT Comments__c,Company_Name__c,Employee_email__c,Employee_ID__c,Experience__c,Id,Name,Primary_Skill__c,Secondary_Skill__c FROM Employee__c] ;
        return emps;
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getAllCertifications(Boolean flag ){
        
        List<Certification__c> certs=new List<Certification__c>();
        if(flag!=true)
        certs = [SELECT Certification_Cost__c,Certification_ID__c,Id,Name FROM Certification__c];
        return certs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Voucher__c> getAllVouchers(Boolean flag ){
        List<Voucher__c> vous=new List<Voucher__c>();
        if(flag!=true)
        vous = [SELECT Active__c,Certification__r.Name,Id,Name,Validity__c,Voucher_Cost__c FROM Voucher__c];
        return vous;
    }

    //code for adding new employee record
    @AuraEnabled
    public static String addNewEmp(String EmpName,String EmpComp,Decimal EmpId,String EmpMail,String EmpPS,String EmpSS,Decimal EmpExp,String EmpComm){
        Employee__c newemp = new Employee__c(Name=EmpName, Employee_ID__c=EmpId, Employee_email__c=EmpMail,Primary_Skill__c=EmpPS, Secondary_Skill__c=EmpSS, Experience__c=EmpExp, Comments__c=EmpComm,	Company_Name__c=EmpComp);
        
        try {insert newemp; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Employee Created Successfully';
        
    }
    //code for adding new certification record
  
    //code for adding new voucher record
    @AuraEnabled
    public static String addNewVou( Decimal VouCost, Date VouValid,String VouCert){
        Voucher__c newvou = new Voucher__c(Voucher_Cost__c=VouCost, Validity__c=VouValid, Certification__c=VouCert);
       try {insert newvou; }
       catch(Exception e){
            return e.getMessage();
       } 
       return 'Voucher Added Successfully';    
    }


    //code for adding new Request record
    @AuraEnabled
    public static String addNewReq(String ReqEmp, String ReqCert, Date ReqDueDate){
        Certification_Request__c newreq = new Certification_Request__c(Employee__c=ReqEmp, Certification__c=ReqCert, Due_Date__c=ReqDueDate);
        try {insert newreq; }
        catch(Exception e){
            //throw e;
            return e.getMessage();
       } 
       return 'Request Added Successfully';      
    }



    //code for submitting request for approval
    @AuraEnabled
    public static String updateRequestInitial(String ReqRecordId,String status,String comments,String cert,String emp,Date dueDate){
        Certification_Request__c updreq = new Certification_Request__c(Id=ReqRecordId,Status__c=status,Comments__c=comments,Certification__c=cert,Due_Date__c=dueDate,Employee__c=emp);
        try {update updreq; }
        catch(Exception e){
            //throw e;
            return e.getMessage();
       } 
       return 'Request Updated Successfully';     
    }

    @AuraEnabled
    public static String updateRequest(String ReqRecordId,String status,String comments){
        Certification_Request__c updreq = new Certification_Request__c(Id=ReqRecordId,Status__c=status,Comments__c=comments);
        try {update updreq; }
        catch(Exception e){
            //throw e;
            return e.getMessage();
       } 
       return 'Request Updated Successfully';     
    }
    @AuraEnabled
    public static String delRequest(String recId){
        Certification_Request__c delReq = new Certification_Request__c(Id=recId);
        try {delete delReq; }
        catch(Exception e){
            return recId;
       } 
       return 'Request deleted Successfully';     
    }

    @AuraEnabled
    public static String delEmp(String recId){
        Employee__c delEmp = new Employee__c(Id=recId);
        try {delete delEmp; }
        catch(Exception e){
            return recId;
       } 
       return 'Employee deleted Successfully';     
    }

    //getting user profile
    @AuraEnabled(cacheable=true)
    public static Profile getUserDetails(String recId) {
        List<User> users= [Select Id , Name ,Email,ProfileId from User where Id =:recId];

       User u=users[0];
       List<Profile> profiles= [Select Name from Profile where Id=:u.ProfileId];
      return profiles[0];
    }

    @AuraEnabled
    public static String addNewCert(String CertName, Decimal CertCost){
        Certification__c newcert = new Certification__c(Name=CertName, Certification_Cost__c=CertCost);
        try {insert newcert; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Certification Created Successfully';       
    }
    @AuraEnabled
    public static String delCert(String recId){
        Certification__c cert = new Certification__c(id=recId);
        try {delete cert; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Certification deleted Successfully';       
    }

    @AuraEnabled
    public static String delVou(String recId){
        Voucher__c voucher = new Voucher__c(id=recId);
        try {delete voucher; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Voucher deleted Successfully';       
    }

    @AuraEnabled
    public static String updCert(String recId,Decimal certCost){
        Certification__c cert = new Certification__c(id=recId,Certification_Cost__c=certCost);
        try {update cert; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Certification updated Successfully';       
    }

    @AuraEnabled
    public static String updVoucher(String recId,Decimal vouCost,Date vouValidity,String vouCert){
        Voucher__c cert = new Voucher__c(id=recId,Certification__c=vouCert,Voucher_Cost__c=vouCost,Validity__c=vouValidity);
        try {update cert; }
        catch(Exception e){
             return e.getMessage();
        } 
        return 'Voucher updated Successfully';       
    }
}
