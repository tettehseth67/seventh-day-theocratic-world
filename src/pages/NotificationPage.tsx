import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SanctuaryNotification } from "../constants/notifications";

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<SanctuaryNotification[]>(
        [],
    );

    useEffect(() => {
        const q = query(
            collection(db, "notifications"),
            orderBy("timestamp", "desc"),
        );

        const unsub = onSnapshot(q, (snapshot) => {
            setNotifications(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as SanctuaryNotification[],
            );
        });

        return () => unsub();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-serif italic text-brand-ink mb-10">
                Notification Archive
            </h1>

            <div className="space-y-4">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className="p-6 bg-white rounded-2xl border border-brand-olive/5"
                    >
                        <h3 className="font-bold text-brand-ink">{n.title}</h3>

                        <p className="text-sm text-brand-ink/60 mt-2">{n.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
