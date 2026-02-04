public with sharing class Cockpit360Controller {

    public class Cockpit360DTO {
        @AuraEnabled public Integer activeSubscriptionsCount;
        @AuraEnabled public Integer openRequestsCount;
        @AuraEnabled public Integer openCasesCount;

        @AuraEnabled public Account account;

        @AuraEnabled public List<Subscription__c> subscriptions;
        @AuraEnabled public List<Customer_Request__c> requests;
        @AuraEnabled public List<Case> casesList;
    }

    @AuraEnabled(cacheable=true)
    public static Cockpit360DTO getCockpit(Id accountId) {
        Cockpit360DTO dto = new Cockpit360DTO();

        // ✅ Account (removed PersonEmail)
        dto.account = [
            SELECT Id, Name, Phone, Industry
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];

        // ✅ Subscriptions (your fields)
        dto.subscriptions = [
            SELECT Id, Name, Status__c, Start_Date__c, End_Date__c, Account__c, Subscription_Number__c
            FROM Subscription__c
            WHERE Account__c = :accountId
            ORDER BY CreatedDate DESC
            LIMIT 5
        ];

        // ✅ Customer Requests
        // NOTE: filter by Account through Subscription relationship: Subscriptions__r.Account__c
        dto.requests = [
            SELECT Id, Name, Request_Status__c, Request_Type__c, CreatedDate, Subscriptions__c, Request_Number__c, Requested_Date__c
            FROM Customer_Request__c
            WHERE Subscriptions__r.Account__c = :accountId
            AND Request_Status__c != 'Closed'
            ORDER BY CreatedDate DESC
            LIMIT 6
        ];

        // ✅ Cases (standard)
        dto.casesList = [
            SELECT Id, CaseNumber, Subject, Status, Priority, CreatedDate
            FROM Case
            WHERE AccountId = :accountId
            AND IsClosed = false
            ORDER BY CreatedDate DESC
            LIMIT 5
        ];

        // ✅ KPI counts
        dto.activeSubscriptionsCount = [
            SELECT COUNT()
            FROM Subscription__c
            WHERE Account__c = :accountId
            AND Status__c = 'Active'
        ];

        dto.openRequestsCount = [
            SELECT COUNT()
            FROM Customer_Request__c
            WHERE Subscriptions__r.Account__c = :accountId
            AND Request_Status__c != 'Closed'
        ];

        dto.openCasesCount = [
            SELECT COUNT()
            FROM Case
            WHERE AccountId = :accountId
            AND IsClosed = false
        ];

        return dto;
    }
}
