import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Phone, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Auth() {
  const { theme, setTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-formats identifier into a standard email or phone-alias email
  const getFormattedEmail = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    // Standard email check
    if (trimmed.includes('@')) {
      return trimmed;
    }

    // Otherwise clean non-numeric characters and format as phone alias email
    const cleanPhone = trimmed.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid email address or 10-digit phone number.');
    }
    return `${cleanPhone}@arc-bilty.com`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!firstName.trim() || !lastName.trim() || !identifier.trim() || !password || !confirmPassword) {
        toast.error('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
    } else {
      if (!identifier.trim() || !password) {
        toast.error('Please fill in all fields.');
        return;
      }
    }

    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured.');
      }

      const email = getFormattedEmail(identifier);

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`,
            }
          }
        });
        if (error) throw error;
        
        if (data?.session) {
          toast.success('Account created successfully! You are now logged in.');
        } else {
          toast.success('Registration successful! Please check your email for a confirmation link, then sign in.');
          setIsSignUp(false); // Redirect to Sign In mode
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] flex flex-col items-center justify-center p-4 relative transition-colors duration-200">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <Button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="outline"
          size="sm"
          className="gap-1.5 border-[var(--line)] hover:bg-[var(--card)] text-[var(--ink)] text-xs h-8 px-2.5 shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-[var(--warning)]" />
              <span className="text-xs font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-[var(--secondary)]" />
              <span className="text-xs font-semibold">Dark</span>
            </>
          )}
        </Button>
      </div>

      {/* Branding Header */}
      <div className="flex flex-col items-center gap-3 mb-8 select-none">
        <div 
          className="flex items-center justify-center rounded-full text-white font-black text-2xl w-16 h-16 border-2 border-[var(--line)] shadow-xl"
          style={{ backgroundColor: '#E11D3C' }}
        >
          ARC
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-[#E11D3C]">
            ANJANEYA ROAD CARRIERS
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">Freight Billing & Consignment Manager</p>
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md bg-[var(--card)] border-[var(--line)] text-[var(--ink)] shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-[var(--ink)]">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center text-[var(--muted)]">
            {isSignUp 
              ? 'Register with your email to start billing' 
              : 'Sign in to access your company dashboard'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[var(--ink)]">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[var(--ink)]">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address or Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-[var(--ink)]">
                {isSignUp ? 'Email Address' : 'Email Address or Phone Number'}
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                  {isSignUp || identifier.includes('@') ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                </span>
                <Input
                  id="identifier"
                  type={isSignUp ? 'email' : 'text'}
                  placeholder={isSignUp ? 'name@example.com' : 'Enter email or 10-digit mobile number'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--ink)]">Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[var(--ink)]">Confirm Password</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted)]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--secondary)]"
                    disabled={loading}
                    required
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-[var(--arc-red)] font-medium mt-1">Passwords do not match.</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[var(--arc-red)] hover:bg-[var(--arc-red-hover)] text-white font-semibold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? 'Register' : 'Sign In'}
            </Button>

            <div className="relative w-full my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--line)]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[var(--card)] px-2 text-[var(--muted)] font-semibold">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.setItem('arc_guest_mode', 'true');
                window.location.reload();
              }}
              className="w-full border-[var(--line)] hover:bg-[var(--surface)] text-[var(--ink)] font-medium text-xs h-9"
            >
              Continue in Offline / Demo Mode
            </Button>

            <div className="text-sm text-center text-[var(--muted)]">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-[var(--secondary)] hover:underline font-medium"
                    disabled={loading}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-[var(--secondary)] hover:underline font-medium"
                    disabled={loading}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
