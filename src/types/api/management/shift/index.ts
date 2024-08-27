export interface IShift {
    id: number;
    name: string;
    companyId: number;
    /**
     * @example "00:00:00+07"
     */
    start: string;
    /**
    * @example "00:00:00+07"
    */
    end: string;
}