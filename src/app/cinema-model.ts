import {SeatType} from './seat/seat-model'

interface Hall {
    width: number
    height: number
    seatWidth: number
    seats: HallSeat[]
}

interface HallSeat  {
    x: number,
    y: number,
    row: number,
    number: number
    type: {
        countSeat: number,
        type: SeatType
    }
    price: number,
    brone: boolean,
    closet: boolean
}
export { Hall, HallSeat }