
/*enum SeatCategory {
    FREE = "FREE",//"cornsilk", //свободное место
    BLOCKED = "BLOCKED", //"maroon", //забронированное место
    SELECTED = "SELECTED", //"forestgreen", //место выбрано
    BOUGTH = "BOUGTH",//"dodgerblue", //место куплено
    NO_ACTIVE = "NO_ACTIVE"//"dimgrey"//местно не активно(невозможно производить операции)
}*/

interface SeatStyle {
    width: string,
    height: string,
    left: string,
    top: string,
    //backgroundColor: string
}

interface Seat {
    x: number,
    y: number,
    row: number,
    number: number
    type: Single | Sofa
    price: number,
    brone: boolean,
    closet: boolean
    //category: SeatCategory
}

enum SeatType {
    SINGLE,
    SOFA
}

class Single {
    private count: number = 1
    get type() {
        return SeatType.SINGLE
    }
    get countSeat() {
        return this.count
    }
}

class Sofa {
    private count: number  = 2

    constructor(count?: number) {
        if(count) {
            this.countSeat = count
        }
    }

    set countSeat(countSeat: number) {
        if (countSeat > 0) {
            this.count = countSeat
        }
    }
    get countSeat(): number {
        return this.count
    }

    get type() {
        return SeatType.SOFA
    }
}

export { SeatStyle, Seat, Single, Sofa, SeatType/*SeatCategory*/}