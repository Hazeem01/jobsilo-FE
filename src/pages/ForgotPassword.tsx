import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.requestPasswordReset(email.trim());
      toast({
        title: "Check your inbox",
        description: response.message,
      });
      setEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to process your request right now.";
      toast({
        title: "Request received",
        description: "If an account exists, a reset link will be sent shortly.",
      });
      console.error("Password reset request failed:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F3F8FF] to-white px-4 py-12">
      <Card className="w-full max-w-md border border-[#2D3559]/10 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D3559]/10">
            <Mail className="h-6 w-6 text-[#2D3559]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2D3559]">Reset your password</CardTitle>
          <p className="text-sm text-[#2D3559]/70">
            Enter the email linked to your Jobsilo account and we&apos;ll send you a reset link.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-[#2D3559]">
                <Mail className="h-4 w-4" />
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isSubmitting}
                className="focus:border-[#2D3559] focus:ring-[#2D3559]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF7C23] to-[#2D3559] text-white shadow transition hover:from-[#e65a1a] hover:to-[#1a1f2e]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 text-center text-sm text-[#2D3559]/80">
          <p>
            Remembered your password?{" "}
            <Link to="/" className="font-medium text-[#FF7C23] hover:underline">
              Return to sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;

