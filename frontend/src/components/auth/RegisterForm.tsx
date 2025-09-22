import { Input, Button } from "@heroui/react"
import { SocialButtons } from "./SocialButtons"

const RegisterForm = () => {
  return (
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
      <Input
        isRequired
        label="Confirm Password"
        placeholder="Confirm your password"
        type="password"
      />
      <Button color="primary" type="submit">
        Sign Up
      </Button>
      <div className="flex items-center gap-4">
        <hr className="w-full" />
        <span>Or</span>
        <hr className="w-full" />
      </div>
      <SocialButtons />
    </form>
  )
}

export default RegisterForm
