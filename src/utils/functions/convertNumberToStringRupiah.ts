const convertNumberToStringRupiah = (num: number) =>
  `${num.toLocaleString('id-ID', {
    currency: 'IDR',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export default convertNumberToStringRupiah;
