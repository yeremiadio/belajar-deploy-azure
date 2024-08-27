const handleClickPrintQr = () => {
    const printContent = document.getElementById('printQr');
    const WinPrint = window.open('', '', 'width=900,height=650');
    if (WinPrint && printContent) {
        WinPrint.document.write(
            `<div style="width:640px;">${printContent.innerHTML}</div>`,
        );
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }
}

export default handleClickPrintQr;