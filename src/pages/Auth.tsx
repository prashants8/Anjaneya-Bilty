import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Phone, Loader2 } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
    if (!identifier || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured.');
      }

      const email = getFormattedEmail(identifier);

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Account created successfully! You are now logged in.');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Branding Header */}
      <div className="flex flex-col items-center gap-3 mb-8 select-none">
        <div 
          className="flex items-center justify-center rounded-full text-white font-black text-2xl w-16 h-16 border-2 border-slate-700 shadow-xl"
          style={{ backgroundColor: '#d32f2f' }}
        >
          ARC
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-rose-500 to-rose-300 bg-clip-text text-transparent">
            ANJANEYA ROAD CARRIERS
          </h1>
          <p className="text-sm text-slate-400 mt-1">Freight Billing & Consignment Manager</p>
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md bg-slate-950 border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            {isSignUp 
              ? 'Register with your email or phone number to start billing' 
              : 'Sign in to access your company dashboard'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            {/* Email or Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="identifier">Email Address or Phone Number</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  {identifier.includes('@') ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                </span>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter email or 10-digit mobile number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-rose-600"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-rose-600"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? 'Register' : 'Sign In'}
            </Button>

            <div className="text-sm text-center text-slate-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-rose-500 hover:underline hover:text-rose-400 font-medium"
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
                    className="text-rose-500 hover:underline hover:text-rose-400 font-medium"
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
