// src/lib/leaders.ts

import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function getLeaders() {
  const q = query(collection(db, "leaders"), orderBy("order", "asc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}