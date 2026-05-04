// src/components/about/MissionVision.tsx

const cards = [
  {
    title: "Our Mission",
    description:
      "To lead people into a deeper relationship with Christ through worship, teaching, and community.",
  },
  {
    title: "Our Vision",
    description:
      "To become a spiritually impactful church transforming lives across generations.",
  },
];

export default function MissionVision() {
  return (
    <section className="pb-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-black/5"
            >
              <h2 className="font-serif text-5xl mb-8">{card.title}</h2>

              <p className="text-lg text-brand-ink/70 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
