
enum SeatCategory {
    FREE = "FREE",//"cornsilk", //свободное место
    BLOCKED = "BLOCKED", //"maroon", //забронированное место
    SELECTED = "SELECTED", //"forestgreen", //место выбрано
    BOUGTH = "BOUGTH",//"dodgerblue", //место куплено
    NO_ACTIVE = "NO_ACTIVE"//"dimgrey"//местно не активно(невозможно производить операции)
}

interface SeatStyle {
    width: string,
    height: string,
    left: string,
    top: string,
    backgroundColor: string
}

interface Seat {
    x: number,
    y: number,
    price?: number,
    category: SeatCategory
    width?: number,
}

export { SeatStyle, Seat, SeatCategory }