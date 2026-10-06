import { Link, useRouter } from "@typeroute/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function SignIn() {
  const router = useRouter();
  const form = useForm();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.navigate({ to: "/" });
    }
  }, [session, router]);

  const onSubmit = async () => {
    const { data: existingUser } = await authClient.getSession();

    if (existingUser) {
      toast.add({
        type: "info",
        title: "Already signed in",
        description: "You are already signed in. Redirecting to chat...",
      });

      router.navigate({ to: "/" });
      return;
    }

    const newUser = await authClient.signIn.anonymous();

    if (newUser.error) {
      toast.add({
        type: "error",
        title: "Error signing in",
        description:
          newUser.error.message ||
          "Unknown error occured while trying to sign in.",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Successfully signed in. Redirecting to chat...",
    });

    router.navigate({ to: "/" });
    return;
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Mark className="size-9 text-primary" />
            <h1 className="text-balance font-bold text-3xl tracking-tight">
              Sign In
            </h1>
            <p className="text-pretty text-muted-foreground text-sm">
              One click. No account. Realtime anonymous chat.
            </p>
          </div>
          <form
            id="sign-in"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <FieldGroup>
              <Field>
                <Button
                  form="sign-in"
                  type="submit"
                  className="h-10 w-full hover:cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner className="size-6" />
                  ) : (
                    "Enter chat"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="text-pretty px-6 text-center">
            By entering, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
