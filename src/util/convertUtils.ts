export const formatDate = (dateString: string) => {
    const options = {
        year: 'numeric' as const,
        month: 'long' as const,
        day: 'numeric' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        second: '2-digit' as const, // Thêm giây nếu cần
        hour12: true as const, // Hiển thị giờ 12h (AM/PM)
    };

    // Tạo đối tượng Date từ chuỗi thời gian UTC
    const date = new Date(dateString); // Chuỗi thời gian UTC

    // Thêm 7 giờ vào thời gian UTC để chuyển về giờ Việt Nam
    date.setHours(date.getHours() + 7);

    // Chuyển về giờ Việt Nam (Asia/Ho_Chi_Minh)
    const vietnamTime = date.toLocaleString('en-US', { ...options, timeZone: 'Asia/Ho_Chi_Minh' });

    return vietnamTime;
};


export const formatNumber = (num: number) => {
    // Định dạng số theo kiểu Việt Nam
    const formattedNumber = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);

    // Thay thế dấu chấm phân cách hàng nghìn bằng chuỗi trống
    // Và thay thế dấu phẩy thành dấu chấm cho phần thập phân
    return formattedNumber.replace(/\./g, ',').replace(/,(?=\d{3})/g, '.');
};
export const adjustTimezone = (dateString: string, offset: number) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + offset);
    return date.toLocaleString();
  };