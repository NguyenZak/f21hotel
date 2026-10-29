// Chạy trong <head> trước khi trang hiện: bật chế độ ẩn chờ hiện (data-motion) nếu khách không chọn giảm chuyển động.
// Nếu sau 5 giây React vẫn chưa chạy (mạng chậm, lỗi JS) thì tắt đi để nội dung không bị ẩn mãi.
export const motionBootScript = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;d.setAttribute("data-motion","");setTimeout(function(){if(!d.hasAttribute("data-motion-ready"))d.removeAttribute("data-motion")},5000)}catch(e){}})()`;
