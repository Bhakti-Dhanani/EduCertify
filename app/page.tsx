'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, ChevronRight, Laptop, Shield, Trophy, Users, GraduationCap, FileText, MessageSquare, BarChart2, Settings, Award, Star, Rocket, Clock, Bookmark } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode, useEffect, useState } from "react";
import Footer from "@/components/shared/footer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Enhanced Animation components
const FadeIn = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const ScaleIn = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Learning & Development Manager",
      company: "TechCorp Inc.",
      content: "This platform transformed our employee training program. The analytics alone helped us increase course completion rates by 45%.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "StartUp Ventures",
      content: "The certification system saved us hundreds of hours in manual credential management. Highly recommended for growing teams.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Emma Rodriguez",
      role: "HR Director",
      company: "Global Enterprises",
      content: "Our employees love the intuitive interface and mobile access. The platform pays for itself in improved productivity.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const [courses, setCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        const enhancedCourses = (data.courses || []).map((course: any, index: number) => ({
          ...course,
          rating: (Math.random() * 1 + 4).toFixed(1),
          students: Math.floor(Math.random() * 1000) + 100,
          duration: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 60)}m`,
          thumbnail: course.thumbnail || `https://source.unsplash.com/random/300x200/?course,${index}`
        }));
        setCourses(enhancedCourses);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background/10 to-background">
      {/* Hero section */}
      <section className="w-full pt-12 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <FadeIn>
                <Badge variant="secondary" className="w-fit px-3 py-1 text-sm font-medium hover:bg-primary/10 transition-colors">
                  Enterprise Learning Platform
                </Badge>
              </FadeIn>
              
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl/none bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                Transform Your <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Organization's</span> Learning
              </h1>
              
              <FadeIn delay={0.2}>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                  A comprehensive platform for organizations to create, manage, and deliver learning experiences with advanced certification capabilities and real-time analytics.
                </p>
              </FadeIn>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <FadeIn delay={0.3}>
                  <Button asChild size="lg" className="h-12 px-8 relative overflow-hidden group">
                    <Link href={ROUTES.SIGN_UP}>
                      <span className="relative z-10">Start Free Trial</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  </Button>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <Button variant="outline" size="lg" className="h-12 px-8 group">
                    <Link href="/demo" className="flex items-center">
                      <span>Request Demo</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </FadeIn>
              </div>
            </div>
            
            <FadeIn delay={0.5}>
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
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-2 border">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/33.jpg" />
                        <AvatarFallback>CT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">Course in progress</p>
                        <Progress value={65} className="h-1 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="w-full py-8 bg-muted/50">
        <div className="container px-4 md:px-6">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-6">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
          </FadeIn>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {["Google", "Microsoft", "Airbnb", "Spotify", "Amazon", "Netflix"].map((company, index) => (
              <FadeIn key={index} delay={0.1 * index}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <div className="text-xl font-bold text-muted-foreground">{company}</div>
                </motion.div>
              </FadeIn>
            ))}
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
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-muted/10 to-background group overflow-hidden h-full">
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

      {/* Stats section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FadeIn>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Active Courses</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500K+</div>
                <p className="text-muted-foreground">Certificates Issued</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2M+</div>
                <p className="text-muted-foreground">Learners</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Courses section */}
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
            {['Data Science', 'IT Certifications', 'Leadership', 'Web Development', 'Communication', 'Business Analytics', 'Artificial Intelligence', 'Statistics', 'Python', 'Machine Learning'].map((category, index) => (
              <FadeIn key={index} delay={0.05 * index}>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors">
                  {category}
                </Badge>
              </FadeIn>
            ))}
          </div>

          {/* Course tabs */}
          <Tabs defaultValue="popular" className="mt-12">
            <TabsList className="grid w-full grid-cols-3 bg-muted h-12">
              <TabsTrigger value="popular" onClick={() => setActiveTab("popular")}>
                Popular
              </TabsTrigger>
              <TabsTrigger value="new" onClick={() => setActiveTab("new")}>
                New Releases
              </TabsTrigger>
              <TabsTrigger value="trending" onClick={() => setActiveTab("trending")}>
                Trending
              </TabsTrigger>
            </TabsList>
            
            {/* Featured Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {courses.slice(0, 8).map((course, index) => (
                <FadeIn key={course.id || index} delay={0.1 * (index % 4)}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-muted/10 to-background group overflow-hidden h-full">
                    <div className="relative rounded-t-lg overflow-hidden">
                      <motion.img
                        src={course.thumbnail}
                        alt={course.title || `Course ${index + 1}`}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 backdrop-blur text-gray-800">
                        {course.category || "Business"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {course.level || "Intermediate"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold line-clamp-2">{course.title || `Course Title ${index + 1}`}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.description || "Brief description of the course content and benefits."}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{course.students}+</span>
                        </div>
                        <span className="text-primary font-bold">₹{course.price || 399}</span>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            
            <FadeIn delay={0.4}>
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  Browse All Courses
                </Button>
              </div>
            </FadeIn>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-4 mb-12">
            <FadeIn>
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium hover:bg-primary/10 transition-colors">
                Testimonials
              </Badge>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Leading Organizations</span>
              </h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={index} delay={0.2 * index}>
                <Card className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <FadeIn>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Ready to Transform Your Learning Experience?
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-primary-foreground/90 mb-8">
                  Join thousands of organizations that trust our platform for their learning and development needs.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="px-8 py-6 text-md font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-6 text-md font-medium bg-white/10 hover:bg-white/20 border-white/20"
                  >
                    Contact Sales
                  </Button>
                </div>
              </FadeIn>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/10"></div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <FadeIn>
                  <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-muted-foreground mb-4">
                    Subscribe to our newsletter for the latest updates, tips, and resources.
                  </p>
                </FadeIn>
              </div>
              <FadeIn delay={0.4}>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 py-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button size="lg" className="py-6 px-8">
                    Subscribe
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}