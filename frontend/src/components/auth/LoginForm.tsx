import { Input, Button, Link, useDisclosure } from "@heroui/react"
import { SocialButtons } from "./SocialButtons"
import { ForgotPasswordModal } from "./modal/ForgotPasswordModal"

const LoginForm = () => {
  const {
    isOpen: isForgotPasswordOpen,
    onOpen: onForgotPasswordOpen,
    onOpenChange: onForgotPasswordOpenChange,
  } = useDisclosure()

  return (
    <>
      <form className="flex flex-col gap-4">
        <Input
          isRequired
          label="Email"
          placeholder="Enter your email"
          type="email"
        />
        <Input
          isRequired
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <div className="flex items-center justify-between">
          <Link href="#" size="sm" onClick={onForgotPasswordOpen}>
            Forgot password?
          </Link>
        </div>
        <Button color="primary" type="submit">
          Sign In
        </Button>
        <div className="flex items-center gap-4">
          <hr className="w-full" />
          <span>Or</span>
          <hr className="w-full" />
        </div>
        <SocialButtons />
      </form>
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onOpenChange={onForgotPasswordOpenChange}
      />
    </>
  )
}

export default LoginForm
