'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, ChevronRight, Laptop, Shield, Trophy, Users, GraduationCap, FileText, MessageSquare, BarChart2, Settings, Award } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import Footer from "@/components/shared/footer";

// Animation components with proper TypeScript types
interface AnimationProps {
  children: ReactNode;
  delay?: number;
}

const FadeIn = ({ children, delay = 0 }: AnimationProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const ScaleIn = ({ children, delay = 0 }: AnimationProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const features = [
    {
      icon: <Laptop className="h-8 w-8" />,
      title: "Intuitive Course Builder",
      description: "Drag-and-drop interface with multimedia support",
      features: [
        "Video, text, and quiz modules",
        "AI-assisted content creation",
        "Version control and history"
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Role-Based Access",
      description: "Tailored interfaces for each user type",
      features: [
        "Custom dashboards by role",
        "Granular permissions",
        "Department-level access"
      ]
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certification Engine",
      description: "Professional certificates upon completion",
      features: [
        "Customizable templates",
        "Verification system",
        "Bulk generation"
      ]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Assignment System",
      description: "Comprehensive assignment workflow",
      features: [
        "File submission",
        "Rubric-based grading",
        "Plagiarism detection"
      ]
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Discussion Forums",
      description: "Engage learners with discussions",
      features: [
        "Course-specific threads",
        "Moderation tools",
        "Rich media support"
      ]
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time progress tracking",
      features: [
        "Completion metrics",
        "Skill gap analysis",
        "Custom reporting"
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background/10 to-background">
      {/* Hero section */}
      <section className="w-full pt-12 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                Transform Your <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Organization's</span> Learning
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                A comprehensive platform for organizations to create, manage, and deliver learning experiences with advanced certification capabilities and real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild size="lg" className="h-12 px-8 relative overflow-hidden group">
                  <Link href={ROUTES.SIGN_UP}>
                    <span className="relative z-10">Start Free Trial</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 group">
                  <Link href="/demo" className="flex items-center">
                    <span>Request Demo</span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="relative rounded-xl border bg-background p-1 shadow-2xl transition-all duration-300 group-hover:shadow-primary/20">
                <div className="overflow-hidden rounded-lg">
                  <motion.img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                    alt="Learning Platform Dashboard"
                    className="w-full h-auto rounded-lg object-cover"
                    width={1200}
                    height={800}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <FadeIn>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium hover:bg-primary/10 transition-colors">
                Powerful Features
              </Badge>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need for <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Enterprise Learning</span>
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <p className="text-lg text-muted-foreground">
                A complete solution designed for organizations to create, manage, and track learning at scale.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={0.1 * index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-muted/10 to-background group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                          whileHover={{ rotate: 10 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start"
                            whileHover={{ x: 5 }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="relative z-10">
                      <Button variant="link" size="sm" className="pl-0 group">
                        Learn more <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Categories and Featured Courses Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All the skills you need in one place
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground">
                From critical skills to technical topics, our platform supports your professional development.
              </p>
            </FadeIn>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Data Science', 'IT Certifications', 'Leadership', 'Web Development', 'Communication', 'Business Analytics & Intelligence', 'Artificial Intelligence (AI)', 'Statistics', 'Python', 'Machine Learning', 'Deep Learning', 'Natural Language Processing'].map((category, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors">
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[1, 2, 3, 4].map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-muted/10 to-background group overflow-hidden">
                <div className="relative rounded-lg overflow-hidden">
                  <motion.img
                    src={`https://via.placeholder.com/300x200?text=Course+${index + 1}`}
                    alt={`Course ${index + 1}`}
                    className="w-full h-auto object-cover"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-bold">Course Title {index + 1}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Brief description of the course content and benefits.
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-primary font-bold">₹399</span>
                    <Badge variant="default">Premium</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}