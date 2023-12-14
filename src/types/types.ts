export type UserType = {
    id: number;
    name: string;
    cpf: string;
    email: string;
    cell: string;
    telephone: string;
    bitSorte: number;
    listBets: BetType[];
    emailVerify: boolean;
    codeCollaborator: string;
    couponDTOS: CouponType[];
    couponDrawnsDTOS: CouponType[];
    notificationDTOS: NotificationUser[];
}

export type CouponType = {
    date: string;
    roomNumber: number;
    coupon: string;
}

export type NotificationUser = {
    id: number;
    type: string;
    title: string;
    message: string;
    date: string;
    visualized: boolean;
    idBet: number;
    bitSorte: number;
}

export type DoneBuyCouponDTO = {
    namePlayer: string;
    valueAward: number;
    valueSpent: number;
    coupon: string;
}

export type RoomPast = {
    valueAward: number;
    valueRoom: number;
    drawDate: string;
    couponDrawn: string;
}

export type BetType = {
    id: number;
    valueAward: number;
    valueBet: number;
    dayCreation: string;
    drawDate: string;
}

export type BankType = {
    id: number;
    name: string;
    urlImg: string;
    linkPayment: string;
}