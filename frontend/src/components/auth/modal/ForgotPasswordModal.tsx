import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ForgotPasswordModal = ({
  isOpen,
  onOpenChange,
}: ForgotPasswordModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Forgot Password</ModalHeader>
            <ModalBody>
              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Input
                isRequired
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Send Reset Link
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

