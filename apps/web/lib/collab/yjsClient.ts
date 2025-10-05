"use client";

import { useEffect, useMemo } from "react";
import * as Y from "yjs";

export function useYDoc(docId: string) {
  const doc = useMemo(() => {
    const ydoc = new Y.Doc();
    ydoc.guid = docId;
    return ydoc;
  }, [docId]);

  useEffect(() => {
    doc.transact(() => {
      doc.getText("root");
    });

    return () => {
      doc.destroy();
    };
  }, [doc, docId]);

  return doc;
}
