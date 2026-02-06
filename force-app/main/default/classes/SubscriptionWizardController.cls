public with sharing class SubscriptionWizardController {
    // ---- DTOs
    public class AccountDTO {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String phone;
        @AuraEnabled public String billingStreet;
        @AuraEnabled public String billingCity;
        @AuraEnabled public String billingPostalCode;
        @AuraEnabled public String billingCountry;
    }
    public class ProductDTO {
        @AuraEnabled public Id productId;
        @AuraEnabled public String name;
        @AuraEnabled public String description;
        @AuraEnabled public Decimal price;
        @AuraEnabled public String family;
    }
    public class CreateRequest {
        @AuraEnabled public Id accountId;
        @AuraEnabled public String offerType;
        @AuraEnabled public Boolean withEngagement;
        @AuraEnabled public Integer engagementMonths;
        @AuraEnabled public Decimal penaltyAmount;
        @AuraEnabled public Date startDate;
        @AuraEnabled public Id planProductId;
        @AuraEnabled public Id deviceProductId;
    }
    public class CreateResponse {
        @AuraEnabled public Id subscriptionId;
        @AuraEnabled public Id engagementId;
    }

    // ---- Account
    @AuraEnabled(cacheable=true)
    public static AccountDTO getAccount(Id accountId) {
        if (accountId == null) return null;
        Account a = [
            SELECT Id, Name, Phone, BillingStreet, BillingCity, BillingPostalCode, BillingCountry
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];
        AccountDTO dto = new AccountDTO();
        dto.id = a.Id;
        dto.name = a.Name;
        dto.phone = a.Phone;
        dto.billingStreet = a.BillingStreet;
        dto.billingCity = a.BillingCity;
        dto.billingPostalCode = a.BillingPostalCode;
        dto.billingCountry = a.BillingCountry;
        return dto;
    }

    // ---- Plans
    @AuraEnabled(cacheable=true)
    public static List<ProductDTO> getPlans(String offerType) {
        if (String.isBlank(offerType)) return new List<ProductDTO>();
        List<PricebookEntry> pbes = [
            SELECT Product2Id, Product2.Name, Product2.Description, Product2.Family, UnitPrice
            FROM PricebookEntry
            WHERE Pricebook2.IsStandard = true
              AND IsActive = true
              AND Product2.IsActive = true
              AND Product2.Family = :offerType
            ORDER BY UnitPrice ASC
            LIMIT 50
        ];
        List<ProductDTO> out = new List<ProductDTO>();
        for (PricebookEntry p : pbes) {
            ProductDTO d = new ProductDTO();
            d.productId = p.Product2Id;
            d.name = p.Product2.Name;
            d.description = p.Product2.Description;
            d.family = p.Product2.Family;
            d.price = p.UnitPrice;
            out.add(d);
        }
        return out;
    }

    // ---- Devices
    @AuraEnabled(cacheable=true)
    public static List<ProductDTO> getDevices() {
        List<PricebookEntry> pbes = [
            SELECT Product2Id, Product2.Name, Product2.Description, Product2.Family, UnitPrice
            FROM PricebookEntry
            WHERE Pricebook2.IsStandard = true
              AND IsActive = true
              AND Product2.IsActive = true
              AND Product2.Family = 'Device'
            ORDER BY UnitPrice ASC
            LIMIT 50
        ];
        List<ProductDTO> out = new List<ProductDTO>();
        for (PricebookEntry p : pbes) {
            ProductDTO d = new ProductDTO();
            d.productId = p.Product2Id;
            d.name = p.Product2.Name;
            d.description = p.Product2.Description;
            d.family = p.Product2.Family;
            d.price = p.UnitPrice;
            out.add(d);
        }
        return out;
    }

    // ---- Create Subscription
    @AuraEnabled
    public static CreateResponse createSubscription(CreateRequest req) {
        if (req == null || req.accountId == null || req.planProductId == null) {
            throw new AuraHandledException('accountId and planProductId are required');
        }
        
        Date startD = (req.startDate == null) ? Date.today() : req.startDate;
        
        Subscription__c sub = new Subscription__c();
        sub.Account__c = req.accountId;
        sub.Start_Date__c = startD;
        sub.End_Date__c = startD.addMonths(12);
        sub.Status__c = 'Active';
        sub.Name = 'SUB - ' + req.offerType + ' - ' + String.valueOf(startD);
        insert sub;

        Id engagementId;
        if (req.withEngagement == true) {
            Engagement__c e = new Engagement__c();
            e.Subscription__c = sub.Id;
            e.Is_Active__c = true;
            e.Start_Date__c = startD;
            Integer m = (req.engagementMonths == null) ? 12 : req.engagementMonths;
            e.Duration__c = String.valueOf(m);
            e.End_Date__c = startD.addMonths(m);
            if (req.penaltyAmount != null) e.Penalty_Amount__c = req.penaltyAmount;
            insert e;
            engagementId = e.Id;
        }

        CreateResponse res = new CreateResponse();
        res.subscriptionId = sub.Id;
        res.engagementId = engagementId;
        return res;
    }
} 