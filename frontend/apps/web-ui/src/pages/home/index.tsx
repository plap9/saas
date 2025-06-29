import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout';
import { Button, Container, Card } from '../../components/ui';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-bg-light text-neutral-900 dark:bg-gradient-bg-dark dark:text-neutral-100">
      {/* Header Navigation */}
      <Header transparent>
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg hover-scale">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-display font-bold text-2xl gradient-text">
            AI Assistant
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium hover-scale">
            Features
          </a>
          <a href="#about" className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium hover-scale">
            About
          </a>
          <a href="#contact" className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium hover-scale">
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/auth/login">
            <Button variant="ghost" className="hidden sm:inline-flex btn-ghost">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="primary" className="btn-primary hover-lift">
              Get Started
            </Button>
          </Link>
        </div>
      </Header>

      {/* Hero Section */}
      <section className="hero section-xl">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">
                  Your{' '}
                  <span className="gradient-text">
                    Intelligent
                  </span>{' '}
                  Assistant for Everything
                </h1>
                
                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Supercharge your productivity with our AI-powered platform. 
                  Automate tasks, get insights, and achieve more with intelligent automation.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="w-full sm:w-auto btn-primary btn-lg hover-lift"
                  >
                    <span>Get Started Free</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto btn-secondary btn-lg hover-lift"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m5-9v18a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2z" />
                  </svg>
                  <span>Watch Demo</span>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-primary rounded-full border-2 border-white dark:border-neutral-900 animate-float" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">2,500+</span> users already joined
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <div className="card-glass p-8 rounded-3xl shadow-xl">
                  <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-success-400 to-success-600 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">Task Completed</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Email automation set up</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-2 bg-gradient-primary rounded-full w-3/4 animate-shimmer"></div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Processing next task...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-sunrise/60 rounded-full animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-accent-mint/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="section-lg bg-white/50 dark:bg-neutral-900/50">
        <Container>
          <div className="text-center space-y-6 mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl">
              Powerful Features for{' '}
              <span className="gradient-text">Modern Teams</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Discover how our AI-powered platform can transform your workflow with intelligent automation, 
              seamless integrations, and powerful analytics.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="card hover-lift group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-body space-y-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center space-x-2 hover-scale">
                    <span>Learn more</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50">
        <Container>
          <div className="section-sm text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2024 AI Assistant Platform. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

// Features Data
const features = [
  {
    title: "Smart Automation",
    description: "Automate repetitive tasks with AI-powered workflows that learn and adapt to your preferences.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Intelligent Insights",
    description: "Get actionable insights from your data with advanced analytics and machine learning algorithms.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Seamless Integration",
    description: "Connect with 100+ popular tools and services to create a unified workflow experience.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time with shared workspaces and instant communication.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "Advanced Security",
    description: "Enterprise-grade security with end-to-end encryption and compliance with industry standards.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team and comprehensive documentation.",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944a11.955 11.955 0 00-8.887 3.664 11.949 11.949 0 000 16.384A11.955 11.955 0 0012 21.056a11.955 11.955 0 008.887-1.664 11.949 11.949 0 000-16.384A11.955 11.955 0 0012 2.944z" />
      </svg>
    )
  }
];

export default HomePage;