import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@heroui/react"
import LoginForm from "../LoginForm"
import RegisterForm from "../RegisterForm"

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const AuthModal = ({ isOpen, onOpenChange }: AuthModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Log in or sign up
            </ModalHeader>
            <ModalBody>
              <Tabs aria-label="Authentication Tabs">
                <Tab key="login" title="Login">
                  <Card>
                    <CardBody>
                      <LoginForm />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="signup" title="Sign Up">
                  <Card>
                    <CardBody>
                      <RegisterForm />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

