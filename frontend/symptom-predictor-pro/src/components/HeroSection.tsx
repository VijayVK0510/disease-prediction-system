import { Brain, Shield, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="text-center py-8 sm:py-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
        <Brain className="w-4 h-4" />
        AI-Powered Disease Prediction
      </div>
      
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
        Understand Your Symptoms
        <br />
        <span className="text-primary">Get Instant Insights</span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Select your symptoms and let our machine learning model analyze potential conditions. 
        Fast, private, and designed to guide—not replace—professional care.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span>Instant Results</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span>Privacy First</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <span>ML-Powered</span>
        </div>
      </div>
    </section>
  );
}
