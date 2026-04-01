import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What does the 12-Week Transformation Plan include?",
    answer: "The program includes a complete physical and mental overhaul with 24/7 dedicated support, private weekly strategy calls, and a custom nutritional architecture tailored to your goals.",
  },
  {
    question: "Where do training sessions take place in Barcelona?",
    answer: "We offer both premium indoor studio sessions and structured outdoor workouts across various adaptable locations in Barcelona, ensuring a fresh and highly-effective training environment.",
  },
  {
    question: "Are these sessions suitable for beginners?",
    answer: "Yes, our programs are fundamentally structured to meet you where you are. Whether you're a complete beginner or an advanced athlete, the programming scales to your current fitness level while pushing you to achieve results.",
  },
  {
    question: "How often should I train?",
    answer: "For optimal results, we typically recommend starting with 3 sessions per week. However, the schedule will be strictly customized based on your goals, capacity, and current lifestyle.",
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading md:text-4xl text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about training with Alex Moreno.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border shadow-sm p-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4 px-2">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-2 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
