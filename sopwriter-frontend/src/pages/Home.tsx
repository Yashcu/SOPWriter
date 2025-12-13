import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export default function Home() {
    // Animation Variants
    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section - Left-aligned */}
            <section className="relative py-24 lg:py-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Left Column - Main Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
                        >
                            {/* Main Headline */}
                            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-foreground">
                                Professional SOP & Visa Guidance
                                <span className="block text-muted-foreground text-3xl sm:text-4xl lg:text-5xl mt-4 font-medium">
                                    for International Applications
                                </span>
                            </motion.h1>

                            {/* Subtext */}
                            <motion.p variants={fadeUp} className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Expert-written documents and one-to-one guidance for students
                                applying abroad.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 justify-center lg:justify-start">
                                <Link to="/wizard">
                                    <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                                        Start Your Application
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto px-8 py-6 border-2 font-medium"
                                    onClick={() =>
                                        document
                                            .getElementById("how-it-works")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                >
                                    How it works
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Illustration with torn paper effect */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={slideInRight}
                            className="flex flex-col justify-between mt-0 order-first lg:order-last w-full lg:h-full"
                        >
                            <div className="relative w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 lg:flex-1">
                                {/* Glow effect behind */}
                                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-lg" />

                                {/* Image with torn effect */}
                                <div className="relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 w-full h-auto lg:h-full" style={{
                                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                                    clipPath: `polygon(
                    0% 2%, 3% 0%, 7% 1%, 11% 0%, 16% 2%, 20% 0%, 25% 1%,
                    30% 0%, 35% 2%, 40% 0%, 45% 1%, 50% 0%, 55% 2%,
                    60% 0%, 65% 1%, 70% 0%, 75% 2%, 80% 0%, 85% 1%,
                    90% 0%, 95% 2%, 98% 0%, 100% 1%,
                    100% 98%, 98% 100%, 95% 99%, 90% 100%, 85% 98%,
                    80% 100%, 75% 99%, 70% 100%, 65% 98%, 60% 100%,
                    55% 99%, 50% 100%, 45% 98%, 40% 100%, 35% 99%,
                    30% 100%, 25% 98%, 20% 100%, 15% 99%, 10% 100%,
                    5% 98%, 2% 100%, 0% 99%,
                    1% 50%, 0% 25%, 1% 75%
                  )`
                                }}>
                                    <img
                                        src="/Hero.png"
                                        alt="Application process"
                                        className="w-full h-auto lg:h-full lg:object-cover"
                                    />
                                </div>
                            </div>

                            {/* Stats filling the empty space on desktop */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="hidden lg:grid grid-cols-3 gap-6 pt-8 border-t border-border/40 mt-8 shrink-0 text-center"
                            >
                                <motion.div variants={fadeUp}>
                                    <div className="text-3xl font-bold text-primary">98%</div>
                                    <div className="text-sm font-medium text-muted-foreground mt-1">Success Rate</div>
                                </motion.div>
                                <motion.div variants={fadeUp}>
                                    <div className="text-3xl font-bold text-primary">5k+</div>
                                    <div className="text-sm font-medium text-muted-foreground mt-1">Students Guided</div>
                                </motion.div>
                                <motion.div variants={fadeUp}>
                                    <div className="text-3xl font-bold text-primary">4.9/5</div>
                                    <div className="text-sm font-medium text-muted-foreground mt-1">User Rating</div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Visual Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* How It Works */}
            <section id="how-it-works" className="py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUp}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            How It Works
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Three simple steps to get started with your application
                        </p>
                    </motion.div>

                    {/* Steps Grid */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-12 lg:gap-16"
                    >
                        {[
                            {
                                step: "01",
                                title: "Choose your requirement",
                                description:
                                    "Select the service you need from SOP writing to visa preparation",
                            },
                            {
                                step: "02",
                                title: "Get expert assistance",
                                description:
                                    "Work directly with experienced writers and counselors",
                            },
                            {
                                step: "03",
                                title: "Pay & get started",
                                description:
                                    "Simple payment process to begin your journey to success",
                            },
                        ].map((item, i) => (
                            <motion.div key={i} variants={fadeUp} className="relative">
                                {/* Connecting line */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-border/50 -z-10"
                                        style={{ marginLeft: '2rem' }} />
                                )}

                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl border-2 border-primary/20 hover:scale-110 transition-transform duration-300">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Visual Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Final CTA */}
            <section className="py-24 lg:py-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mx-auto max-w-4xl px-6 text-center"
                >
                    <div className="space-y-8">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Get expert guidance for your international application today
                        </p>
                        <div className="pt-4">
                            <Link to="/wizard">
                                <Button size="lg" className="px-10 py-6 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    Start Your Application
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Trust Strip */}
            <section className="border-t border-border/50">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <p className="text-center text-sm text-muted-foreground">
                        Trusted by students applying to USA, Canada, UK, Australia
                    </p>
                </div>
            </section>
        </div>
    );
}
