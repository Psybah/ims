import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, HardDrive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const SignupForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await register(fullName, email, phoneNumber, password);
    if (result === true) {
      navigate('/'); // Navigate to login on successful registration
    } else {
      setError(result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary p-2 sm:p-4">
      <div className="w-full max-w-md space-y-3 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Join the File Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Sign Up</CardTitle>
            <CardDescription className="text-sm">
              Enter your details to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-10 sm:h-11 text-sm sm:text-base" />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 sm:h-11 text-sm sm:text-base" />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="h-10 sm:h-11 text-sm sm:text-base" />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-10 sm:h-11 text-sm sm:text-base" />
              </div>

              {error && (
                <Alert variant="destructive" className="py-2 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-10 sm:h-11 bg-gradient-primary hover:bg-primary-hover text-sm sm:text-base" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};