import React from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react"

const ImageCropModal = ({ isOpen, onClose, image, onSave }) => {
  // A proper implementation would use a library like react-image-crop
  // to provide cropping functionality. For now, we'll just show the image
  // and provide a "Save" button.

  const handleSave = () => {
    // In a real implementation, we would pass the cropped image data
    // to the onSave callback. Here, we'll just pass the original image file.
    if (image) {
      onSave(image)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Crop Profile Picture</ModalHeader>
        <ModalBody>
          <p>
            Image cropping functionality would be implemented here. For now,
            we'll just save the original image.
          </p>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile Preview"
              style={{ maxWidth: "100%" }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ImageCropModal
