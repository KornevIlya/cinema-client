
interface HallStyle {
    width: string,
    height: string,

}

class AddSeatError {
    private isError
    private message

    constructor(message?: string) {
        this.message = message ? message : ""
        this.isError = message ? true : false
    }

    setError(message: string): void {
        this.message = message
        this.isError = true
    }

    hasError(): boolean {
        return this.isError
    }

    getMessage(): string {
        return this.message
    }
}
export { HallStyle, AddSeatError }