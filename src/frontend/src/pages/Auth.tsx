import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Auth() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Pharmote
          </h1>
          <p className="text-muted-foreground mt-2">
            Your educational notes platform
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full bg-secondary mb-6" data-ocid="auth.tab">
            <TabsTrigger
              value="login"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Pharmote uses secure Internet Identity for authentication. No
                passwords needed.
              </p>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-xl"
                data-ocid="auth.login_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  "Login with Internet Identity"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Create your account using Internet Identity — secure, private,
                and passwordless.
              </p>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-xl"
                data-ocid="auth.signup_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  "Sign Up with Internet Identity"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
