import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import "./index.css"

interface DataCardProps {
  size: string
  year: string
  rating: number
  title: string
  description: string
  tags: string[]
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <Icon
    icon="lets-icons:star-fill"
    width="25"
    height="25"
    style={{ color: filled ? "var(--color-yellow)" : "var(--color-gray2)" }}
  />
)

export const DataCard: React.FC<DataCardProps> = ({
  size,
  year,
  rating,
  title,
  description,
  tags,
}) => {
  return (
    <Card className="max-w-[500px] rounded-4xl p-4">
      <CardHeader className="flex justify-between">
        <div className="flex" style={{ direction: "ltr" }}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
        </div>
        <div className="flex gap-2">
          <Chip color="default" variant="flat">
            {year}
          </Chip>
          <Chip color="default" variant="flat">
            {size}
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="gap-4">
        <h2 className="text-3xl font-bold" style={{ textAlign: "left" }}>
          {title}
        </h2>
        <p
          className="text-default-500"
          style={{ textAlign: "justify", direction: "ltr" }}
        >
          {description}
        </p>
        <div className="flex gap-2 mt-4 flex-wrap justify-end">
          {tags.map((tag) => (
            <Chip key={tag} color="primary" variant="flat">
              {tag}
            </Chip>
          ))}
        </div>
      </CardBody>
      <CardFooter className="gap-3">
        <Button color="primary" variant="solid" className="w-full rounded-full">
          درخواست داده
        </Button>
        <Button color="default" variant="solid" className="w-full rounded-full">
          اطلاعات بیشتر
        </Button>
      </CardFooter>
    </Card>
  )
}
