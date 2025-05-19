import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { School } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col items-center justify-center p-12">
        <div className="max-w-md mx-auto text-center">
          <School className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Learning Platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enterprise-grade learning and certification platform with course management, assignments, certificates, and more.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-medium">Complete Courses</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Access a variety of courses with interactive content
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-medium">Get Certified</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Earn certificates to showcase your achievements
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-medium">Track Progress</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Monitor your learning journey in real-time
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="font-medium">Engage in Forums</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Discuss and learn with peers and instructors
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <School className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Learning Platform</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}