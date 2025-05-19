import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Users, BookOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Learning Platform",
  description: "Admin dashboard for the Learning Platform",
};

// Mock data for charts
const userActivityData = [
  { name: "Jan", students: 42, instructors: 11 },
  { name: "Feb", students: 53, instructors: 13 },
  { name: "Mar", students: 61, instructors: 15 },
  { name: "Apr", students: 65, instructors: 16 },
  { name: "May", students: 78, instructors: 19 },
  { name: "Jun", students: 89, instructors: 21 },
  { name: "Jul", students: 102, instructors: 24 },
];

const courseCompletionData = [
  { name: "Web Dev", value: 85 },
  { name: "Data Science", value: 72 },
  { name: "Mobile App", value: 68 },
  { name: "Machine Learning", value: 65 },
  { name: "Cloud Computing", value: 45 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Monitor and manage your learning platform.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">245</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">32</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Certificates Issued</p>
                <p className="text-2xl font-bold">182</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">$24,508</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly growth of students and instructors
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="students" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="instructors" 
                      stroke="hsl(var(--chart-2))" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Completion</CardTitle>
                <CardDescription>
                  Percentage of course completion by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {courseCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed analytics will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-muted-foreground">
                Advanced analytics content will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                System generated reports and exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-muted-foreground">
                Reports content will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform activities and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <p className="font-medium">New Course Created</p>
                <p className="text-sm text-muted-foreground">Advanced Machine Learning with Python</p>
              </div>
              <span className="text-sm text-muted-foreground">Today, 10:30 AM</span>
            </div>
            
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <p className="font-medium">User Registered</p>
                <p className="text-sm text-muted-foreground">John Doe (Student)</p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday, 5:45 PM</span>
            </div>
            
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <p className="font-medium">Certificate Generated</p>
                <p className="text-sm text-muted-foreground">Web Development Fundamentals - Alice Smith</p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday, 2:15 PM</span>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-muted-foreground">$129.99 - Full Stack Development Course</p>
              </div>
              <span className="text-sm text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}