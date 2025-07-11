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
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <HardDrive className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">File Management</h1>
          <p className="text-muted-foreground">Secure document management system</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your files and manage your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:bg-primary-hover"
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
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo123');
                }}
              >
                <div className="flex items-center space-x-3">
                  <account.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{account.role}</p>
                    <p className="text-xs text-muted-foreground">{account.email}</p>
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