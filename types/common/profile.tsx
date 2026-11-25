export interface MenuItemData {
    id: string
    icon: React.ReactNode
    title: string
    description: string
    route?: string
    action?: string
    danger?: boolean
    iconBgColor?: string
}

export interface MenuSection {
    title?: string
    items: MenuItemData[]
}