import React from "react"
import { Card, CardBody } from "@heroui/react"
import { Icon } from "@iconify/react"

interface Feature {
  icon: string
  title: string
  description: string
}

interface FeatureGridProps {
  title: string
  features: Feature[]
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  features,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardBody>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                    <Icon
                      icon={feature.icon}
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
