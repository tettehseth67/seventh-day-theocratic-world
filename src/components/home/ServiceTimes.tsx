// src/components/home/ServiceTimes.tsx

const services = [
  {
    title: "Sunday Worship",
    time: "8:00 AM",
  },
  {
    title: "Bible Study",
    time: "Wednesday • 6:00 PM",
  },
  {
    title: "Youth Service",
    time: "Friday • 7:00 PM",
  },
];

export default function ServiceTimes() {
  return (
    <section className="pb-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-brand-olive">
            Join Us
          </span>

          <h2 className="font-serif text-5xl mt-6">Service Times</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-[2rem] p-10 shadow-lg border border-black/5 text-center"
            >
              <h3 className="font-serif text-3xl mb-4">{service.title}</h3>

              <p className="text-brand-ink/70">{service.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
