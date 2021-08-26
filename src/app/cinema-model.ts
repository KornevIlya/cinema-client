import { Seat } from './seat/seat-model'

interface Hall {
    width: number
    height: number
    seatWidth: number
    seats: Seat[]
}

export { Hall }