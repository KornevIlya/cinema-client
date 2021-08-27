
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
    private seatCount: number = 1
    private seatType: SeatType = SeatType.SINGLE
    get type() {
        return this.seatType
    }
    get countSeat() {
        return this.seatCount
    }
    // type: SeatType = SeatType.SINGLE
    // countSeat: number = 1
}

class Sofa {
    // countSeat: number = 2
    // type: SeatType = SeatType.SOFA

    // constructor(count?: number) {
    //     if(count) {
    //         this.countSeat = count
    //     }
    // }
    private seatCount: number  = 2
    private seatType: SeatType = SeatType.SOFA

    constructor(count?: number) {
        if(count) {
            this.countSeat = count
        }
    }

    set countSeat(countSeat: number) {
        if (countSeat > 0) {
            this.seatCount = countSeat
        }
    }
    get countSeat(): number {
        return this.seatCount
    }

    get type() {
        return this.seatType
    }
}

export { SeatStyle, Seat, Single, Sofa, SeatType/*SeatCategory*/}