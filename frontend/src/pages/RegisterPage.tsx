import RegisterForm from "../components/auth/RegisterForm"

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          ایجاد حساب کاربری
        </h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
