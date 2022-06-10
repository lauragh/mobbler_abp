
export class Payment {

    constructor(
        public companyia: string,
        public plan: number,
        public periodoIni: Date,
        public periodoFin: Date,
        public precio: number,
        public fechaC: Date,
        public uid?: string,
    )
    {}

}

