import React, { useEffect } from "react"
import { Icon } from "@iconify/react"
import "./sidebar.css"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  useEffect(() => {
    const navMenus = document.querySelectorAll(".sidebar-nav__menu")

    const updateActiveIndicator = (menu: Element) => {
      const activeItem = menu.querySelector(
        ".sidebar-nav__item:has(input:checked)"
      ) as HTMLElement
      if (!activeItem) {
        if (menu)
          (menu as HTMLElement).style.setProperty(
            "--active-indicator-height",
            "0px"
          )
        return
      }

      const indicatorHeight = activeItem.offsetHeight
      const indicatorTop = activeItem.offsetTop
      ;(menu as HTMLElement).style.setProperty(
        "--active-indicator-height",
        `${indicatorHeight}px`
      )
      ;(menu as HTMLElement).style.setProperty(
        "--active-indicator-top",
        `${indicatorTop}px`
      )
    }

    if (navMenus && navMenus.length > 0) {
      navMenus.forEach((menu) => updateActiveIndicator(menu))
      const resizeObserver = new ResizeObserver(() => {
        navMenus.forEach((menu) => updateActiveIndicator(menu))
      })
      resizeObserver.observe(document.body)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [activeTab])

  const navItems = [
    {
      id: "dashboard",
      label: "کارتابل",
      icon: "streamline-sharp:dashboard-circle-solid",
    },
    { id: "profile", label: "پروفایل", icon: "solar:user-bold" },
    { id: "messages", label: "پیام ها", icon: "tabler:message-circle-filled" },
    {
      id: "projects",
      label: "پروژه ها",
      icon: "material-symbols:folder-open-rounded",
    },
  ]

  return (
    <fieldset className="sidebar-nav">
      <legend className="sidebar-nav__legend">Profile Navigation</legend>

      <div className="sidebar-nav__menu">
        {navItems.map((item) => (
          <label className="sidebar-nav__item" key={item.id}>
            <input
              className="sidebar-nav__input"
              type="radio"
              name="nav-item"
              value={item.id}
              checked={activeTab === item.id}
              onChange={() => onTabChange(item.id)}
            />
            <Icon
              icon={item.icon}
              className="sidebar-nav__icon"
              width="20"
              height="20"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="sidebar-nav__menu sidebar-nav__bottom-menu">
        <label
          className="sidebar-nav__item"
          onClick={() => onTabChange("learning")}
        >
          <input
            className="sidebar-nav__input"
            type="radio"
            name="nav-item"
            value="learning"
            checked={activeTab === "learning"}
            onChange={() => onTabChange("learning")}
          />
          <Icon
            icon="ic:round-school"
            className="sidebar-nav__icon"
            width="20"
            height="20"
          />
          <span>آموزش</span>
        </label>

        <label
          className="sidebar-nav__item sidebar-nav__item--danger"
          onClick={onLogout}
        >
          <input
            className="sidebar-nav__input"
            type="radio"
            name="nav-item"
            value="exit"
          />
          <Icon
            icon="solar:exit-bold"
            className="sidebar-nav__icon"
            width="20"
            height="20"
          />
          <span>خروج</span>
        </label>
      </div>
    </fieldset>
  )
}

export default Sidebar
