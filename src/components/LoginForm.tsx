import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, Users, HardDrive } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try admin@filemanagement.com with password: demo123');
    }
  };

  const demoAccounts = [
    { email: 'admin@filemanagement.com', role: 'Admin', icon: Shield },
    { email: 'chinedu@company.com', role: 'User', icon: Users }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary p-2 sm:p-4">
      <div className="w-full max-w-md space-y-3 sm:space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-1 sm:space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">File Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Secure document management system</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Sign In</CardTitle>
            <CardDescription className="text-sm">
              Access your files and manage your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="py-2 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 bg-gradient-primary hover:bg-primary-hover text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2 sm:space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo123');
                }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <account.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">{account.role}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">demo123</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};