import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Loader2, HardDrive } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("" as any);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password, role);
    if (typeof result === "string") {
      setError(result);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            File Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Secure document management system
          </p>
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
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
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
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="login-role" className="text-sm">
                  Login As:
                </Label>
                <Select
                  value={role}
                  name="login-role"
                  onValueChange={(value) => setRole(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2 sm:py-3">
                  <AlertDescription className="text-xs sm:text-sm">
                    {error}
                  </AlertDescription>
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
                  "Sign In"
                )}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
