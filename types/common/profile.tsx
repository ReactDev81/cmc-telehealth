interface MenuItemData {
    id: string
    icon: React.ReactNode
    title: string
    description: string
    route: string
}

export interface MenuSection {
    title?: string
    items: MenuItemData[]
}