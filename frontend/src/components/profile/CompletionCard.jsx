// frontend/src/components/profile/CompletionCard.jsx
import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Progress,
  Button,
  Chip,
  Alert,
} from "@heroui/react"
import { Icon } from "@iconify/react"

const CompletionCard = ({ data, onRefresh }) => {
  if (!data) return null

  const {
    completion_percentage,
    is_complete,
    missing_fields = [],
    recommendations,
  } = data

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "success"
    if (percentage >= 60) return "warning"
    return "danger"
  }

  const getProgressLabel = (percentage) => {
    if (percentage >= 80) return "Great Profile!"
    if (percentage >= 60) return "Good Progress"
    return "Needs Attention"
  }

  return (
    <Card className="border-2 border-dashed border-primary-200 bg-primary-50/50">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary-900">
            Profile Completion
          </h3>
          <p className="text-sm text-primary-700">
            Complete your profile to unlock all features
          </p>
        </div>
        <Chip
          color={getProgressColor(completion_percentage)}
          variant="flat"
          startContent={
            is_complete ? (
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            ) : null
          }
        >
          {getProgressLabel(completion_percentage)}
        </Chip>
      </CardHeader>

      <CardBody className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {completion_percentage}% Complete
            </span>
            <span className="text-xs text-default-500">
              {8 - missing_fields.length} of 8 fields completed
            </span>
          </div>
          <Progress
            value={completion_percentage}
            color={getProgressColor(completion_percentage)}
            className="w-full"
            size="md"
            aria-label="Profile completion percentage"
          />
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <Alert
                key={index}
                color={rec.type === "urgent" ? "warning" : "primary"}
                variant="flat"
                title={rec.title || rec.message}
                description={rec.action}
                startContent={
                  rec.type === "urgent" ? (
                    <Icon
                      icon="heroicons:exclamation-triangle"
                      className="w-5 h-5"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:information-circle"
                      className="w-5 h-5"
                    />
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Missing Fields */}
        {missing_fields && missing_fields.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Missing Information:</h4>
            <div className="flex flex-wrap gap-2">
              {missing_fields.map((field) => (
                <Chip
                  key={field.field}
                  size="sm"
                  color={field.priority === "high" ? "warning" : "default"}
                  variant="flat"
                >
                  {field.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {is_complete && (
          <div className="flex items-center gap-2 text-success-600">
            <Icon icon="heroicons:check-circle" className="w-5 h-5" />
            <span className="text-sm font-medium">
              Your profile is complete! 🎉
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default CompletionCard
