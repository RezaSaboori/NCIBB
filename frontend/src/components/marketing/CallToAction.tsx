import React from "react"
import { Button } from "@heroui/react"
import { Link } from "react-router-dom"

interface CallToActionProps {
  title: string
  description: string
  action: {
    text: string
    link: string
  }
}

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="mt-8">
          <Link to={action.link}>
            <Button color="primary" size="lg">
              {action.text}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
