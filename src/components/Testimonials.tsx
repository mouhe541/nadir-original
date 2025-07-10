import { motion, Variants } from 'framer-motion';
import { Crown, Star, Heart, Truck } from 'lucide-react';

const Testimonials = () => {
  const stats = [
    {
      icon: Crown,
      number: "+2k",
      label: "Clientes Satisfaites"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Note Moyenne"
  },
  {
      icon: Heart,
      number: "98%",
      label: "Taux de Satisfaction"
  },
  {
      icon: Truck,
      number: "24h",
      label: "Livraison Express"
  }
];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-serif signature-text relative inline-block">
            Pourquoi nous choisir ?
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Nous nous engageons à offrir une qualité exceptionnelle et un service irréprochable. Voici ce qui nous distingue.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 flex flex-col items-center justify-center text-center border border-primary/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,215,0,0.15)]"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-serif">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;