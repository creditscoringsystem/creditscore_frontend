// app/(dashboard)/help/page.tsx  – hoặc đặt ở nơi bạn muốn trong tree Next.js
'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import Icon from '@/components/AppIcon';

/* ---------- Kiểu dữ liệu ---------- */
type HelpItem = {
  title: string;
  description: string;
};

type HelpSection = {
  title: string;
  icon: string;            // tên icon trong lucide-react
  items: HelpItem[];
};

type FAQ = {
  question: string;
  answer: string;
};

/* ---------- Component ---------- */
const HelpDashboard: React.FC = () => {
  const helpSections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: 'Play',
      items: [
        { title: 'Understanding Your Credit Score', description: 'Learn how credit scores work and what factors influence them' },
        { title: 'Setting Up Alerts', description: 'Configure notifications for important credit changes' },
        { title: 'Reading Your Reports', description: 'Interpret your credit reports and identify key areas' }
      ]
    },
    {
      title: 'Features Guide',
      icon: 'Book',
      items: [
        { title: 'Score Analysis', description: 'Deep dive into credit factor breakdowns and trends' },
        { title: 'Scenario Simulator', description: 'Model what-if scenarios for credit improvement' },
        { title: 'Alert Management', description: 'Customize and manage your notification preferences' }
      ]
    },
    {
      title: 'Account Support',
      icon: 'Settings',
      items: [
        { title: 'Profile Settings', description: 'Update your personal information and preferences' },
        { title: 'Privacy & Security', description: 'Manage your data privacy and account security' },
        { title: 'Subscription Management', description: 'View and modify your subscription plan' }
      ]
    }
  ];

  const faqs: FAQ[] = [
    {
      question: 'How often is my credit score updated?',
      answer: 'Your credit score is updated daily based on new information from credit bureaus. Major changes typically appear within 24-48 hours.'
    },
    {
      question: 'What factors affect my credit score the most?',
      answer: 'Payment history (35%) and credit utilization (30%) have the biggest impact. Length of credit history (15%), new credit (10%), and credit mix (10%) also play important roles.'
    },
    {
      question: 'How can I improve my credit score quickly?',
      answer: 'The fastest improvements come from paying down credit card balances to reduce utilization below 30%, and ensuring all payments are made on time.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use bank-level encryption and security measures. Your data is protected with 256-bit SSL encryption and we never share your information without consent.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-80">
        <Header />

        <main className="pt-20 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Help &amp; Support
              </h1>
              <p className="text-muted-foreground">
                Find answers to common questions and learn how to make the most of your credit monitoring experience
              </p>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-xl">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                />
              </div>
            </div>

            {/* Help Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {helpSections.map((section) => (
                <div key={section.title} className="bg-card rounded-lg border border-border p-6 shadow-elevation-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={section.icon} size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.title} className="cursor-pointer hover:bg-muted p-3 rounded-lg transition-smooth">
                        <div className="font-medium text-foreground text-sm mb-1">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
                    <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-card rounded-lg border border-border p-8 text-center shadow-elevation-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MessageCircle" size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-smooth neon-glow">
                  Contact Support
                </button>
                <button className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-smooth">
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpDashboard;
