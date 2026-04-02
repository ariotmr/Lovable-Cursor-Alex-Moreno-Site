import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "What does the 12-Week Transformation Plan include?",
    answer: "The program includes a complete physical and mental overhaul with 24/7 dedicated support, private weekly strategy calls, and a custom nutritional architecture tailored to your goals.",
  },
  {
    question: "Where do training sessions take place in Barcelona?",
    answer: "Alex Moreno offers both premium indoor studio sessions in the Eixample district and structured outdoor workouts at Ciutadella Park, Barceloneta Beach, and Montjuïc, providing a versatile training environment across Barcelona.",
  },
  {
    question: "Are these sessions suitable for beginners?",
    answer: "Yes. All programs by Alex Moreno are structured to meet you at your current fitness level. Whether you're a complete beginner or an advanced athlete, the programming scales accordingly while pushing you to achieve measurable results.",
  },
  {
    question: "How often should I train per week?",
    answer: "For optimal results, Alex Moreno typically recommends starting with 3 sessions per week. However, the schedule is strictly customized based on your individual goals, recovery capacity, and lifestyle.",
  },
  {
    question: "How much does a personal trainer cost in Barcelona?",
    answer: "Personal training rates in Barcelona vary by coach and program type. Alex Moreno's flagship 12-Week Transformation Plan is currently available at a special launch rate. Visit the Courses page for current pricing and what's included.",
  },
  {
    question: "What qualifications does Alex Moreno have?",
    answer: "Alex Moreno is a certified Strength & Conditioning Coach with over 10 years of professional experience and 500+ clients trained across all fitness levels. He specializes in structured periodized programming for busy professionals.",
  },
  {
    question: "How long is each training session?",
    answer: "Each session is 55 minutes long, structured from warm-up to cool-down. Every minute is planned in advance to maximize efficiency — ideal for professionals with tight schedules.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-32 relative overflow-hidden bg-[#0b1120]" aria-labelledby="faq-heading">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Support & Guidance</span>
          </div>
          <h2 id="faq-heading" className="text-4xl font-bold font-heading md:text-5xl text-white mb-6">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get clarity on the transformation process and logistics of strength training with Alex Moreno in Barcelona.
          </p>
        </header>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-4 md:p-10 shadow-2xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-none bg-white/[0.03] rounded-2xl px-6 transition-all hover:bg-white/[0.05]"
              >
                <AccordionTrigger className="text-left font-bold text-white hover:no-underline py-5 text-sm md:text-base tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed pb-6 text-sm md:text-base border-t border-white/5 pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Professional E-A-T Badge */}
        <div className="mt-16 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 text-center">
          <div className="flex gap-4 mb-4">
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
               <ShieldCheck className="h-3 w-3" />
               Certified Coach
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
               <Sparkles className="h-3 w-3" />
               10+ Years Experience
             </div>
          </div>
          <p className="text-sm text-slate-400 italic">
            "My goal is to provide absolute clarity before we start the work. If you have any other questions, reach out via the inquiry form below."
          </p>
          <div className="mt-4 flex items-center gap-3">
             <div className="h-10 w-10 rounded-full border border-primary/30 p-0.5">
               <img 
                 src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&q=80" 
                 alt="Alex Moreno" 
                 className="h-full w-full rounded-full object-cover"
               />
             </div>
             <span className="text-xs font-bold text-white uppercase tracking-tighter">Coach Alex Moreno</span>
          </div>
        </div>
      </div>
    </section>
  );
};
