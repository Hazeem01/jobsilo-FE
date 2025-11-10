import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const MIN_PASSWORD_LENGTH = 6;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const resetToken = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      toast({
        title: "Reset link invalid",
        description: "We could not find a valid reset token. Please request a new link.",
        variant: "destructive",
      });
    }
  }, [resetToken, toast]);

  const validate = () => {
    if (!resetToken) {
      return "Reset token is missing or invalid. Please request a new link.";
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errorMessage = validate();
    if (errorMessage) {
      toast({
        title: "Unable to reset password",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.resetPassword(resetToken, newPassword);

      toast({
        title: "Password updated",
        description: response.message,
      });

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password right now.";
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTokenMissing = !resetToken;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F3F8FF] to-white px-4 py-12">
      <Card className="w-full max-w-md border border-[#2D3559]/10 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D3559]/10">
            <Lock className="h-6 w-6 text-[#2D3559]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2D3559]">Set a new password</CardTitle>
          <p className="text-sm text-[#2D3559]/70">
            Enter a strong password you haven&apos;t used before on Jobsilo.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium text-[#2D3559]">
                <Lock className="h-4 w-4" />
                New password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={isSubmitting || isTokenMissing}
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  className="pr-10 focus:border-[#2D3559] focus:ring-[#2D3559]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#2D3559] hover:text-[#FF7C23]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-[#2D3559]">
                <Lock className="h-4 w-4" />
                Confirm new password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isSubmitting || isTokenMissing}
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  className="pr-10 focus:border-[#2D3559] focus:ring-[#2D3559]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#2D3559] hover:text-[#FF7C23]"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF7C23] to-[#2D3559] text-white shadow transition hover:from-[#e65a1a] hover:to-[#1a1f2e]"
              disabled={isSubmitting || isTokenMissing}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 text-center text-sm text-[#2D3559]/80">
          {isTokenMissing ? (
            <p>
              Need a new link?{" "}
              <Link to="/forgot-password" className="font-medium text-[#FF7C23] hover:underline">
                Request password reset
              </Link>
            </p>
          ) : (
            <p>
              Ready to sign in?{" "}
              <Link to="/" className="font-medium text-[#FF7C23] hover:underline">
                Return to sign in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;

