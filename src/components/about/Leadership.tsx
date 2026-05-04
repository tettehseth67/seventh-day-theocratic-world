import { useEffect, useState } from "react";
import { getLeaders } from "../../lib/leaders";

export default function Leadership() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    getLeaders().then(setLeaders);
  }, []);

  return (
    <section>
      {leaders.map((leader) => (
        <div key={leader.id}>{leader.name}</div>
      ))}
    </section>
  );
}
