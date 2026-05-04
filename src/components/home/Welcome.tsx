// src/components/home/Welcome.tsx

export default function Welcome() {
  return (
    <section className="py-28">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-olive">
          Who We Are
        </span>

        <h2 className="font-serif text-5xl mt-6 mb-8">
          Building Lives Through Christ
        </h2>

        <p className="text-lg leading-relaxed text-brand-ink/70">
          We are passionate about helping people encounter God, grow in faith,
          and build strong relationships through worship, teaching, and
          community outreach.
        </p>
      </div>
    </section>
  );
}
