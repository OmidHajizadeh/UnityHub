import { appwriteConfig, databases } from "@/lib/AppWirte/config";
import { Query } from "appwrite";
import { getCurrentUser } from "./userAPI";
import { Audit } from "@/types";

export function createAudit(audit: Audit, auditId: string) {
  const newAuditPromise = databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.auditCollectionId,
    auditId,
    audit
  );

  return newAuditPromise;
}

export function deleteAudit(auditId: string) {
  const deletedAudit = databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.auditCollectionId,
    auditId
  );

  return deletedAudit;
}

export async function getAudits({ pageParam }: { pageParam: number }) {
  const user = await getCurrentUser();

  const queries: string[] = [
    Query.equal("userId", user.$id),
    Query.orderDesc("$createdAt"),
    Query.limit(10),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  const audits = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.auditCollectionId,
    queries
  );
  return audits;
}
