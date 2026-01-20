'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Brain,
  BarChart3,
  Users,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";
import TestimonialCard from "@/components/testimonial-card";
import FeatureCard from "@/components/feature-card";
import PricingCard from "@/components/pricing-card";
import { usePhonePePayment } from "@/app/_hooks/usePhonePePayment";

export default function LandingPage() {
  const { initiatePayment, loading } = usePhonePePayment();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 mx-auto">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AI-Powered Contests Tailored to Your Expertise
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  &quot;Engage in adaptive learning experiences designed for your profession and skill level, powered by intelligent AI to help you grow.&quot;
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/user/questionnaire/original">
                      Start Your First Contest
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#how-it-works">See How It Works</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/assets/images/hero.png"
                width={1312}
                height={759}
                alt="AI Contest Platform Dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to excel
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our AI-powered platform offers a comprehensive suite of features designed to enhance your development experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <FeatureCard icon={<Brain className="h-10 w-10 text-primary" />} title="AI-Tailored Questions" description="Questions dynamically generated based on your profession, expertise level, and development goals." />
              <FeatureCard icon={<BarChart3 className="h-10 w-10 text-primary" />} title="Adaptive Difficulty" description="Contests that automatically adjust difficulty based on your performance and progress." />
              <FeatureCard icon={<Users className="h-10 w-10 text-primary" />} title="Peer Competitions" description="Compete with professionals in your field to benchmark your knowledge and skills." />
              <FeatureCard icon={<Clock className="h-10 w-10 text-primary" />} title="Real-time Feedback" description="Instant, detailed explanations and feedback to accelerate your development." />
              <FeatureCard icon={<Award className="h-10 w-10 text-primary" />} title="Skill Certification" description="Earn certificates and badges to showcase your expertise and achievements." />
              <FeatureCard icon={<CheckCircle2 className="h-10 w-10 text-primary" />} title="Progress Tracking" description="Comprehensive analytics to monitor your improvement over time." />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How TalentTank Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Get started in minutes and begin your journey to mastery.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {["Create Your Profile", "Select a Contest", "Learn & Improve"].map((title, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-center text-muted-foreground">
                    {[
                      "Tell us about your profession, expertise level, and development goals.",
                      "Choose from AI-recommended contests or create a custom challenge.",
                      "Participate, receive feedback, and track your progress over time."
                    ][index]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <div className="relative w-full max-w-4xl rounded-xl border bg-background p-2 shadow-lg">
                <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
                  <video src="/assets/images/talentank.mp4" autoPlay loop muted className="z-10"></video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Choose the plan that&apos;s right for you and start improving today.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-xl items-start gap-6 py-12 lg:grid-cols-1">
              <PricingCard
                title="Professional"
                price="₹599"
                description="Ideal for serious learners"
                features={[
                  "Unlimited contests",
                  "Advanced analytics",
                  "AI-generated questions",
                  "Priority support",
                  "Custom development paths",
                ]}
                buttonText="Subscribe Now"
                highlighted
                onClick={() => initiatePayment(599)}
                loading={loading}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  What Our Users Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Hear from professionals who have transformed their development experience with TalentTank.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <TestimonialCard
                quote="TalentTank has completely transformed how I prepare for certifications. The AI-tailored questions match exactly what I need to learn."
                author="Sarah Johnson"
                role="Software Engineer"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
              <TestimonialCard
                quote="As a medical professional, staying current is crucial. This platform helps me identify knowledge gaps I didn't even know I had."
                author="Dr. Michael Chen"
                role="Cardiologist"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
              <TestimonialCard
                quote="The adaptive difficulty is what sets this apart. It's like having a personal tutor who knows exactly when to challenge me more."
                author="Alex Rodriguez"
                role="Financial Analyst"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
