import { Section } from "lucide-react";

export default function CTASection() {
  return (
    <Section>
      <div className="bg-slate-900 text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Us This Sunday</h2>
        <p className="text-slate-300 mb-6">
          Experience worship, community, and the Word in a life-changing way.
        </p>

        <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition">
          Plan Your Visit
        </button>
      </div>
    </Section>
  );
}
