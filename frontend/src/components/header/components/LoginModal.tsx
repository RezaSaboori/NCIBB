import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react"
import { useState } from "react"

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const LoginModal = ({ isOpen, onOpenChange }: LoginModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          <Input label="Email" placeholder="Enter your email" />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => onOpenChange(false)}>Cancel</Button>
          <Button color="primary">Login</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
