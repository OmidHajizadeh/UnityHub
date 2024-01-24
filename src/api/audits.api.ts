import { Query } from "appwrite";

import { UnityHubError } from "@/lib/utils";
import { appwriteConfig, databases } from "@/lib/AppWirte/config";
import { getCurrentUser } from "@/api/user.api";
import { Audit, UnityHubDocumentList } from "@/types";

export function createAudit(audit: Audit, auditId: string) {
  return databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.auditCollectionId,
    auditId,
    audit
  );
}

export function deleteAudit(auditId: string) {
  return databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.auditCollectionId,
    auditId
  );
}

export async function getAudits({ pageParam }: { pageParam: number }) {
  const user = await getCurrentUser();
  if (!user)
    throw new UnityHubError(
      "شما اجازه دسترسی به گزارش ها را ندارید",
      "لطفا به حساب کاربری خود وارد شوید"
    );

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

  if (!audits)
    throw new UnityHubError("خطا در دریافت گزارش ها", "لطفا صفحه را رفرش کنید");

  return audits as UnityHubDocumentList<Audit>;
}
