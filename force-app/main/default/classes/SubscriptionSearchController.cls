public with sharing class SubscriptionSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Subscription__c> search(String keyword, Id accountId) {
        String k = (keyword == null) ? '' : keyword.trim();
        String likeK = '%' + k + '%';

        String baseQuery =
            'SELECT Id, Name, Status__c, Start_Date__c, End_Date__c, Account__c, Account__r.Name ' +
            'FROM Subscription__c ';

        List<String> whereParts = new List<String>();

        if (accountId != null) whereParts.add('Account__c = :accountId');

        if (!String.isBlank(k)) {
            whereParts.add('(Name LIKE :likeK OR Account__r.Name LIKE :likeK)');
        }

        String whereClause = (whereParts.isEmpty()) ? '' : (' WHERE ' + String.join(whereParts, ' AND '));
        String finalQuery = baseQuery + whereClause + ' ORDER BY CreatedDate DESC LIMIT 200';

        return Database.query(finalQuery);
    }
}
