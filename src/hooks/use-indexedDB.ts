import { IDBStores } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useReadAllFromIDB = <T>(storeName: IDBStores) => {
  const req = indexedDB.open("Dynamic-JSON");
  const [indexedDBData, setIndexedDBData] = useState<T[]>();

  const successHandler = useCallback((event: Event) => {
    const IDB = (event.target as IDBOpenDBRequest).result;

    const tx = IDB.transaction(storeName, "readonly");
    tx.oncomplete = () => IDB.close();
    const store = tx.objectStore(storeName);
    const request: IDBRequest<T[]> = store.getAll();
    request.onsuccess = (event) => {
      setIndexedDBData((event.target as any).result);
    };
  }, []);

  useEffect(() => {
    req.onsuccess = successHandler;
  }, []);

  return indexedDBData;
};

export const useReadFromIDB = <T>(storeName: IDBStores, id: string) => {
  const req = indexedDB.open("Dynamic-JSON");
  const [indexedDBData, setIndexedDBData] = useState<T>();

  const successHandler = useCallback((event: Event) => {
    const IDB = (event.target as IDBOpenDBRequest).result;

    const tx = IDB.transaction(storeName, "readonly");
    tx.oncomplete = () => IDB.close();
    const store = tx.objectStore(storeName);
    const request: IDBRequest<T> = store.get(id);
    request.onsuccess = (event) => {
      setIndexedDBData((event.target as any).result);
    };
  }, []);

  useEffect(() => {
    req.onsuccess = successHandler;
  }, []);

  return indexedDBData;
};
